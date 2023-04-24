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
import EditDelete from "./EditDelete";
 
 function PollOption(props) {
 
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
	 const disabled = props.onSelect == null || props.elevated;
	 return (
		 <div className={`option ${props.selected ? "selected" : ""} ${correctClass} ${disabled ? "disabled" : ""}`} onClick={() => { if (!disabled) props.onSelect() }}>
			 <div className="select-box" />
			 <span className="option-text">{props.children}{props.elevated ? <EditDelete canEdit={props.elevated} handleEdit={editPollChoice} /> : null}</span>
			 <span className="option-text label">{correctLabel}</span>
		 </div>
	 );
 
 }
 
 export default PollOption; 