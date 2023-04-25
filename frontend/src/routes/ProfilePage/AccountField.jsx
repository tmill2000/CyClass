import React, { createRef, useState } from "react";

import "./style.css";

function AccountField(props) {

	// State
	const [editing, setEditing] = useState(false);

	// Component
	const inputElement = createRef();
	return (
		<div className="account-field">
			<div className="label">{props.label}</div>
			{ editing ? ([
				<input ref={inputElement} className="input" type={props.secret ? "password" : "text"} defaultValue={props.secret ? "" : props.current} />,
				<button className="standard button save" onClick={() => {props.onEdit(inputElement.current.value); setEditing(false)}}>SAVE</button>,
				<button className="standard button cancel" onClick={() => setEditing(false)}>CANCEL</button>
			]) : (
				<div className="input" onClick={() => setEditing(true)}>{props.secret ? "•".repeat(10) : props.current}</div>
			)}
		</div>
	);

}

export default AccountField;