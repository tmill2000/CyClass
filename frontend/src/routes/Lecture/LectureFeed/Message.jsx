/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	02/05/2023
 */

import React from "react";

import TimeLabel from "./TimeLabel";
import ProfileIcon from "../../../components/ProfileIcon";

import "./styles.css";

function Message(props) {

	// Component
	return (
		<div className={`msg ${props.me ? "me" : ""}`}>
			<div className="post-container">
				<TimeLabel time={props.time}/>
				<div className="post-bubble">
					<span className="selectable">{props.text}</span>
				</div>
			</div>
			{(props.user != null) ?
			<div className="user-container">
				<ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
			</div>
			: null}
		</div>
	);

}

export default Message;