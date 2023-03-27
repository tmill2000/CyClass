/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/30/2022
 * UPDATED:	03/27/2023
 * 
 * PROPS:
 * - api: LiveLectureAPI
 */

import React, { createRef, useState } from "react";

import Button from "../../../components/Button/Button";

import attachmentImg from "./attachment.png";
import "./styles.css";

function NewMessageEntry(props) {

	// Refs and state
	const textBoxRef = createRef();
	const [selectedFile, setSelectedFile] = useState(null);

	// Click handlers
	const attachFile = (e) => {
		if (selectedFile == null) {
			document.getElementById("file-select").click();
		} else {
			setSelectedFile(null);
		}
	}
	const sendMsg = (e) => {
		const msg = textBoxRef.current.value.trim();
		if (msg != "") {
			props.api.sendMessage(msg, false, selectedFile);
			textBoxRef.current.value = "";
			setSelectedFile(null);
		}
	};

	// Component
	return (
		<div className="lme-container">
			<div className="lme-line" />
			<textarea ref={textBoxRef} className="lme-textbox" />
			<div className="lme-buttonarea">
				<input id="file-select" type="file" style={{display: "none"}} onChange={(e) => setSelectedFile(e.target.files != null ? e.target.files[0] : null)} />
				<span className="lme-selected-file" style={{display: selectedFile != null ? "block" : "none"}}><strong>Attached:</strong> {selectedFile?.name}</span>
				<button id="attach-button" className={"lme-circlebutton" + (selectedFile != null ? " attached" : "")} onClick={attachFile}><img src={attachmentImg} /></button>
				<button id="send-button" className="lme-button" onClick={sendMsg}>SEND</button>
			</div>
		</div>
	);

}

export default NewMessageEntry;