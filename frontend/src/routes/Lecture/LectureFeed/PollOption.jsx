/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/14/2023
 * UPDATED:	02/21/2023
 * 
 * PROPS:
 * - onSelect: function
 * - selected: boolean
 * - correct?: boolean
 */

 import React, { useState } from "react";

 import "./styles.css";
 
 function PollOption(props) {
	
	const [hovering, setHovering] = useState(false); // New state hook for hover tracking
 
	 // Decide on "correct" style class/label
	 let correctClass = "", correctLabel;
	 if (props.correct != null) {
		 correctClass = props.correct ? "correct" : "wrong";
		 correctLabel = props.correct ? "Correct" : "Incorrect";
	 } else {
		 correctLabel = props.selected ? "Selected" : "";
	 }

	 const editPollChoice = () => {
	   const updatedChoice = prompt("Enter updated poll choice:");
	   if (updatedChoice != null) {
		 props.api.editPollChoiceText(props.pollID, props.id, updatedChoice)
	   }
	 };
 
	 // Component
	 return (
		 <button className={`option ${props.selected ? "selected" : ""} ${correctClass}`} onClick={props.onSelect} disabled={props.onSelect == null}
		 onMouseEnter={() => setHovering(true)}
		 onMouseLeave={() => setHovering(false)}>
			 <div className="select-box" />
			 <span className="option-text">{props.children}</span>
			 <span className="option-text label">{correctLabel}</span>
			 {props.canEdit && (
				<button className="edit-button" onClick={editPollChoice}>
				Edit Choice
				</button>
				)}
		 </button>
	 );
 
 }
 
 export default PollOption; 