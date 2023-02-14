/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/14/2023
 * UPDATED:	02/14/2023
 * 
 * PROPS:
 * - onSelect: function
 * - selected: boolean
 * - correct?: boolean
 */

import React from "react";

import "./styles.css";

function PollOption(props) {

	// Decide on "correct" style class/label
	let correctClass = "", correctLabel;
	if (props.correct != null) {
		correctClass = props.correct ? "correct" : "wrong";
		correctLabel = props.correct ? "Correct" : "Incorrect";
	} else {
		correctLabel = props.selected ? "Selected" : "";
	}

	// Component
	return (
		<button className={`option ${props.selected ? "selected" : ""} ${correctClass}`} onClick={props.onSelect}>
			<div className="select-box" />
			<span className="option-text">{props.children}</span>
			<span className="option-text label">{correctLabel}</span>
		</button>
	);

}

export default PollOption;