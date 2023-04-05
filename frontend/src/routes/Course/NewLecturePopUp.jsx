/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	04/05/2023
*/

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { PopUpForm } from "../../components/PopUp";

import "./styles.css";

function NewLecturePopUp(props) {

	// Hooks
	const navigate = useNavigate();

	// Create handler
	const create = (inputs) => {
		
		// Make new lecture, navigating to it if successful and closing otherwise
		return props.api.newLecture(inputs.title)
			.then((id) => navigate(`lecture/${id}`))
			.catch((err) => props.onClose());

	};

	// Component
	return (
		<PopUpForm
			title="New Lecture"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="CREATE"
			onSubmit={create}
			inputs={[
				{
					label: "Lecture Title",
					name: "title",
					type: "text",
					validator: (input) => input != ""
				}
			]} />
	);

}

export default NewLecturePopUp;