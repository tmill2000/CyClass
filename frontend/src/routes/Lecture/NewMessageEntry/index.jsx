/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/30/2022
 * UPDATED:	11/30/2022
 * 
 * PROPS:
 * - api: LiveLectureAPI
 */

import React, { createRef } from "react";

import Button from "../../../components/Button/Button";

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
				<Button buttonStyle="btn--post--solid" buttonSize="btn--medium" onClick={sendMsg}>SEND</Button>
			</div>
		</div>
	);

}

export default NewMessageEntry;