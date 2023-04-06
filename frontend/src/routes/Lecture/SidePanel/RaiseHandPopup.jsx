/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/05/2023
 * UPDATED:	04/05/2023
*/

import React from "react";

import { PopupForm } from "../../../components/PopUp";

export default function RaiseHandPopup(props) {

	// Submit handler
	const submit = (inputs) => {
		
		// Submit new question
		return props.api.sendQuestion(inputs.question, inputs.anonymous);

	};

	// Component
	return (
		<PopupForm
			title="Ask Question"
			enabled={props.visible}
			onClose={props.onClose}
			onSubmit={submit}
			inputs={[
				{
					label: "Question",
					name: "question",
					type: "paragraph",
					validator: (input) => input != ""
				},
				{
					label: "Anonymous",
					name: "anonymous",
					type: "boolean"
				}
			]} />
	);

}