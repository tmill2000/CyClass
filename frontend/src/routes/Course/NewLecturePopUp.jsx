/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React from "react";
import { useNavigate } from "react-router-dom";

import "./styles.css";

let making = false;

function NewLecturePopUp(props) {

	// Hooks
	const navigate = useNavigate();

	// Create handler
	const create = () => {

		// If already making, do nothing
		if (making) {
			return;
		}

		// Get needed elements
		const titleElement = document.getElementById("lecture-title");

		// Get/validate values
		let invalid = false;
		const title = titleElement.value.trim();
		if (title == "") {
			titleElement.className = "invalid";
			invalid = true;
		}
		if (invalid) {
			return;
		}
		
		// Passed, so make new lecture, navigating to it if successful and closing otherwise
		making = true;
		props.api.newLecture(title)
			.then((id) => navigate(`lecture/${id}`))
			.catch((err) => props.onClose())
			.finally(() => {
				making = false;
			});

	};

	// Component
	return (
		<div className="nl-popup" hidden={!props.visible}>
			<div>
				<div className="header">
					<span className="title">New Lecture</span>
					<button className="close" onClick={props.onClose}>X</button>
				</div>
				<div className="header-line" />
				<div className="input-container">
					<div className="label">
						<span>Lecture Title</span>
					</div>
					<input onChange={(e) => e.target.className = ""} id="lecture-title"/>
				</div>
				<button className="submit" onClick={create}>CREATE</button>
			</div>
		</div>
	)

}

export default NewLecturePopUp;