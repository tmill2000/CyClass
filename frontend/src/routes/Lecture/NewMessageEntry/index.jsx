/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/30/2022
 * UPDATED:	03/27/2023
 * 
 * PROPS:
 * - api: LiveLectureAPI
 */

import React, { createRef } from "react";

import Button from "../../../components/Button/Button";

import attachmentImg from "./attachment.png";
import "./styles.css";

function NewMessageEntry(props) {

	// Refs
	const textBoxRef = createRef();

	// Click handler
	const sendMsg = (e) => {
		const msg = textBoxRef.current.value.trim();
		if (msg != "") {
			props.api.sendMessage(msg, false);
			textBoxRef.current.value = "";
		}
	};

	// Component
	return (
		<div className="lme-container">
			<div className="lme-line" />
			<textarea ref={textBoxRef} className="lme-textbox" />
			<div className="lme-buttonarea">
				
				<button className="lme-button send-button" onClick={sendMsg}>SEND</button>
			</div>
		</div>
	);

}

export default NewMessageEntry;