import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProfileIcon from "../../../components/ProfileIcon";

import TimeLabel from "./TimeLabel";
import PollOption from "./PollOption";
import EditDelete from "./EditDelete";
import "./styles.css";

let allowResponse = true;
const selectedCache = {};

function Poll(props) {
	const [selected, setSelected] = useState(selectedCache[props.id] || null);
	selectedCache[props.id] = selected;

	useEffect(
		() => {
			if (props.api != null && props.id != null && selected == null) {
				props.api.getPollResponse(props.id).then((choice) => {
					if (choice.choiceID != null) {
						setSelected(choice.choiceID);
					}
				});
			}
		},
		[props.api, props.id, selected]
	);

	const editPollPrompt = () => {
		const updatedPrompt = prompt("Enter updated poll prompt:");
		if (updatedPrompt != null) {
			props.api.editPollPrompt(props.id, updatedPrompt)
		}
	};

	const onSelect = (choiceID) => {
		if (!props.closed && props.api != null && allowResponse) {
			allowResponse = false;
			props.api
				.respondToPoll(props.id, choiceID)
				.then(() => setSelected(choiceID))
				.finally(() => (allowResponse = true));
		}
	};

	const onClose = () => {
		if (!props.closed && props.api != null) {
			props.api.closePoll(props.id);
		}
	};

	const choices = props.choices.map(x => x).sort((x, y) => x.id - y.id);

	const resultsURL = `results?poll=${props.id}`;

	return (
		<li className={`poll ${props.me ? "me" : ""}`}>
			<div>
				<TimeLabel time={props.time} />
				<div className="post-bubble">
					<div className="poll-header">
						<div className="title-container">
							<div className="container">
								<span className="title">POLL{props.closed ? " (closed)" : ""}</span>
							</div>
							<div className="line" />
						</div>
						{!props.closed && props.elevated ? <button className="button close" onClick={onClose}>CLOSE</button> : null}
						{props.elevated ? <Link className="button results" to={resultsURL}>VIEW PARTICIPATION</Link> : null}
					</div>
					<div className="content">
						<span>{props.prompt}{props.elevated ? <EditDelete canEdit={props.elevated} handleEdit={editPollPrompt} /> : null}</span>
						<div>
							{choices.map(x => <PollOption key={x.id.toString()}
								id={x.id}
								pollID={props.id}
								api={props.api}
								elevated={props.elevated}
								onSelect={!props.closed ? () => onSelect(x.id) : null}
								selected={x.id == selected}
								correct={props.closed ? x.correct == true : null}>
								{x.text}
							</PollOption>)}
						</div>
					</div>
				</div>
			</div>
			{(props.user != null) ?
				<div className="user-container">
					<ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
				</div>
				: null}
		</li>
	);
}
export default Poll;