/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/30/2022
 * UPDATED:	03/27/2023
 * 
 * PROPS:
 * - api: LiveLectureAPI
 */

import React, { createRef, useState } from "react";

import attachmentImg from "./attachment.png";
import "./styles.css";

function NewMessageEntry(props) {

	// Refs and state
	const textBoxRef = createRef();
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileIssue, setFileIssue] = useState("");

	// Event handlers
	const fileInputChanged = (e) => {
		let file = e.target.files != null ? e.target.files[0] : null;
		if (file != null) {
			const [isOkay, reason] = props.api.isAttachmentAcceptable(file);
			if (!isOkay) {
				setFileIssue(reason);
				setSelectedFile(null);
				return;
			}
		}
		setFileIssue("");
		setSelectedFile(file);
	}
	const attachFile = (e) => {
		if (selectedFile == null) {
			document.getElementById("file-select").click();
		} else {
			setFileIssue("");
			setSelectedFile(null);
		}
	}
	const sendMsg = (e) => {
		const msg = textBoxRef.current.value.trim();
		if (msg != "") {
			const anonInput = document.getElementById("lme-anon");
			props.api.sendMessage(msg, anonInput.checked, selectedFile);
			textBoxRef.current.value = "";
			anonInput.checked = false;
			setFileIssue("");
			setSelectedFile(null);
		}
	};

	// Component
	return (
		<div className="lme-container">
			<div className="lme-line" />
			<textarea ref={textBoxRef} className="lme-textbox" />
			<div className="lme-buttonarea">
				<div className="lme-anon-container">
					<input id="lme-anon" type="checkbox" />
					Anonymous
				</div>
				{fileIssue == "" ? (
					<span className="lme-selected-file" style={{display: selectedFile != null ? "block" : "none"}}>
						<strong>Attached:</strong> {selectedFile?.name}
					</span>
				) : (
					<span className="lme-file-issue">{fileIssue}</span>
				)}
				<input id="file-select" type="file" style={{display: "none"}} onChange={fileInputChanged} />
				<button id="attach-button" className={"button lme-circlebutton" + (selectedFile != null ? " attached" : "")} onClick={attachFile}><img src={attachmentImg} /></button>
				<button id="send-button" className="button lme-button" onClick={sendMsg}>SEND</button>
			</div>
		</div>
	);

}

export default NewMessageEntry;