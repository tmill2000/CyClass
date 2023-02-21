/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	02/21/2023
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProfileIcon from "../../../components/ProfileIcon";

import TimeLabel from "./TimeLabel";
import PollOption from "./PollOption";

import "./styles.css";

let allowResponse = true;
const selectedCache = {};

function Poll(props) {

	// Define selected state
	const [selected, setSelected] = useState(selectedCache[props.id] == true);
	selectedCache[props.id] = selected

	// Define select function
	const onSelect = (choiceID) => {
		if (!props.closed && props.api != null && allowResponse) {
			allowResponse = false;
			props.api.respondToPoll(props.id, choiceID)
				.then(() => setSelected(choiceID))
				.finally(() => allowResponse = true);
		}
	};

	// Lazy-retrieve user's selection
	useEffect(() => {
		if (props.api != null && props.id != null && selected == null) {
			props.api.getPollResponse(props.id)
				.then((choice) => {
					if (choice.choiceID != null) {
						setSelected(choice.choiceID);
					}
				});
		}
	}, [ props.id, props.closed ]);

	// Sort choices by ID
	const choices = (props.choices || {}).map(x => x).sort((x, y) => x.id - y.id);

	// Make URL for results
	const resultsURL = `results?poll=${props.id}`;

	// Component
	return (
		<li className={`poll ${props.me ? "me" : ""}`}>
			<div>
				<TimeLabel time={props.time}/>
				<div className="post-bubble">
					<div className="poll-header">
						<div className="title-container">
							<div className="container">
								<span className="title">POLL{ props.closed ? " (closed)" : "" }</span>
							</div>
							<div className="line" />
						</div>
						<Link className="results-button" to={resultsURL}>VIEW PARTICIPATION</Link>
					</div>
					<div className="content">
						<p>{props.prompt}</p>
						<div>
							{choices.map(x => <PollOption
								onSelect={props.closed ? () => onSelect(x.id) : null}
								selected={x.id == selected}
								correct={x.correct != null ? x.correct : null}>
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