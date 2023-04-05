/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React, { useEffect, useRef } from "react";
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

	// Effects
	useEffect(() => {

		// Get pop-up
		const popup = document.getElementById("new-lecture-popup");

		// Check if visible
		if (props.visible) {

			// Unhide with transition
			popup.style.display = "flex";
			const timer = setTimeout(() => {
				popup.style.backdropFilter = "blur(3px)";
				popup.children[0].style.height = "90%";
			}, 0);
			return () => clearTimeout(timer);

		} else {

			// Hide with transition
			popup.style.backdropFilter = "blur(0px)";
			popup.children[0].style.height = "0%";
			const timer = setTimeout(() => {
				popup.style.display = "none";
			}, 400);
			return () => clearTimeout(timer);

		}

	}, [ props.visible ]);

	// Component
	return (
		<div id="new-lecture-popup" className="nl-popup" style={{display: "none"}}>
			<div>
				<div className="content">
					<div className="header">
						<span className="title">New Lecture</span>
						<button className="close button" onClick={props.onClose}>X</button>
					</div>
					<div className="header-line" />
					<div className="input-container">
						<div className="label">
							<span>Lecture Title</span>
						</div>
						<input onChange={(e) => e.target.className = ""} id="lecture-title"/>
					</div>
					<button className="submit button" onClick={create}>CREATE</button>
				</div>
			</div>
		</div>
	)

}

export default NewLecturePopUp;