/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	04/18/2023
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProfileIcon from "../../../components/ProfileIcon";

import TimeLabel from "./TimeLabel";
import PollOption from "./PollOption";
import EditDelete from "./EditDelete";
import "./styles.css";

function getSecondsLeft(closeTime) {
	return Math.floor((closeTime.getTime() - Date.now()) / 1000);
}

let allowResponse = true;
const selectedCache = {};

function Poll(props) {

	// State
	const [timeLeft, setTimeLeft] = useState(props.closeDate != null ? getSecondsLeft(props.closeDate) : 1);
	const [selected, setSelected] = useState(selectedCache[props.id] || null);
	selectedCache[props.id] = selected;
	const isClosed = timeLeft <= 0;

	// Effect for pulling current selection / auto-updating
	useEffect(() => {
		if (props.api != null && props.id != null && selected == null) {
			props.api.getPollResponse(props.id).then((choice) => {
				if (choice.choiceID != null) {
					setSelected(choice.choiceID);
				}
			});
		}
	}, [props.api, props.id, selected]);
	useEffect(() => {
		if (timeLeft > 0 && props.closeDate != null) {
			const timer = setInterval(() => {
				const newTimeLeft = getSecondsLeft(props.closeDate);
				if (newTimeLeft != timeLeft) {
					if (newTimeLeft <= 0) {
						props.api.refreshPoll(props.id);
					}
					clearInterval(timer);
					setTimeLeft(newTimeLeft);
				}
			}, 500);
			return () => clearInterval(timer);
		}
	}, [ timeLeft ]);

	// Various handlers
	const onSelect = (choiceID) => {
		if (!isClosed && props.api != null && allowResponse) {
			allowResponse = false;
			props.api
				.respondToPoll(props.id, choiceID)
				.then(() => setSelected(choiceID))
				.finally(() => (allowResponse = true));
		}
	};
	const onClose = () => {
		if (!isClosed && props.api != null) {
			props.api.closePoll(props.id);
		}
	};
	const editPollPrompt = () => {
		const updatedPrompt = prompt("Enter updated poll prompt:");
		if (updatedPrompt != null) {
			props.api.editPollPrompt(props.id, updatedPrompt)
		}
	};

	// Time left string generation
	let timeLeftStr = "";
	if (!isClosed && props.closeDate != null) {
		let min = "", sec = "";
		if (timeLeft > 60) {
			min = `${Math.floor(timeLeft / 60)}m`;
		}
		if (timeLeft % 60 > 0) {
			sec = `${timeLeft % 60}s`;
		}
		timeLeftStr = min + (min != "" ? " " : "") + sec + " remaining";
	}

	// Component
	const resultsURL = `results?poll=${props.id}`;
	const choices = props.choices.map(x => x).sort((x, y) => x.id - y.id);
	return (
		<li className={`poll ${props.me ? "me" : ""}`}>
			<div>
				<TimeLabel time={props.time} />
				<div className="post-bubble">
					<div className="poll-header">
						<div className="title-container">
							<div className="container">
								<span className="title">POLL{isClosed ? " (closed)" : ""}</span>
								<span className="time-left">{timeLeftStr}</span>
							</div>
							<div className="line" />
						</div>
						{!isClosed && props.elevated ? <button className="button close" onClick={onClose}>CLOSE</button> : null}
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
								onSelect={!isClosed ? () => onSelect(x.id) : null}
								selected={x.id == selected}
								correct={isClosed ? x.correct == true : null}>
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