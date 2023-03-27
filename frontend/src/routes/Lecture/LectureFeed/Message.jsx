/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	03/27/2023
 */

import React from "react";

import TimeLabel from "./TimeLabel";
import Attachment from "./Attachment";
import ProfileIcon from "../../../components/ProfileIcon";

import "./styles.css";

function Message(props) {

	// Component
	return (
		<li className={`msg ${props.me ? "me" : ""}`}>
			<div className="post-container">
				<TimeLabel time={props.time}/>
				<div className="post-bubble">
					<span className="selectable">{props.text}</span>
					{props.attachment != null ?
					<div className="attachment-list">
						<Attachment id={props.attachment.id} />
					</div>
					: null}
				</div>
			</div>
			{(props.user != null) ?
			<div className="user-container">
				<ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
			</div>
			: null}
		</li>
	);

}

export default Message;