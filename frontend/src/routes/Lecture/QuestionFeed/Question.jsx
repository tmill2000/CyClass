/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/05/2023
 * UPDATED:	04/05/2023
*/

import React from "react";

import ProfileIcon from "../../../components/ProfileIcon";

import "./styles.css";

export default function Question(props) {

	// Click handlers
	const deleteQ = () => {
		props.api.deleteQuestion(props.id);
	}

	// Component
	return (
		<div className="question">
			<div className="bubble selectable">
				{props.question}
			</div>
			<div className="under">
				<button className="clear standard button" onClick={deleteQ}>ANSWERED</button>
				<div className="user-container">
					<div>
						<ProfileIcon profile_name={props.user.name} profile_role={props.user.role} flipped={true} />
					</div>
				</div>
			</div>
		</div>
	)

}