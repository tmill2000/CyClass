/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	02/14/2023
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProfileIcon from "../../../components/ProfileIcon";

import TimeLabel from "./TimeLabel";
import PollOption from "./PollOption";

import "./styles.css";

let allowResponse = true;

function Poll(props) {

	// Define selected state
	const [selected, setSelected] = useState(props.selected);
	const [correct, setCorrect] = useState(props.correct);

	// Define select function
	const onSelect = (choiceID) => {
		if (props.api != null && allowResponse) {
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
					if (choice.correct) {
						setCorrect(choice.choiceID);
					}
				});
		}
	}, [ props.api, props.id ]);

	// Sort options
	const options = (props.options || {}).map(x => x).sort((x, y) => x.choiceID - y.choiceID);

	// Make URL for results
	const resultsURL = `results?poll=${props.id}`;

	// Component
	return (
		<div className={`poll ${props.me ? "me" : ""}`}>
			<div>
				<TimeLabel time={props.time}/>
				<div className="post-bubble">
					<div className="poll-header">
						<div className="title-container">
							<div className="container">
								<span className="title">POLL</span>
								<span className="close-time">closes in 2 min</span>
							</div>
							<div className="line" />
						</div>
						<Link className="results-button" to={resultsURL}>VIEW PARTICIPATION</Link>
					</div>
					<div className="content">
						<p>{props.prompt}</p>
						<div>
							{options.map(x => <PollOption
								onSelect={() => onSelect(x.choiceID)}
								selected={x.choiceID == selected}
								correct={correct != null ? x.choiceID == correct : null}>
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
		</div>
	);

}

export default Poll;