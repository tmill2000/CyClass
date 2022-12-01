/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	11/06/2022
 */

import React from "react";
import { useEffect } from "react";

import ProfileIcon from "../../../components/ProfileIcon";

import "./styles.css";

function pmod(x, y) {
	return ((x % y) + y) % y;
}

function LectureMessage(props) {

	// Check if time was specified
	let timeText;
	if (props.time != null) {

		// Generate time string
		const date = new Date();
		date.setTime(props.time);
		const timeStr = `${pmod(date.getHours() - 1, 12) + 1}:${date.getMinutes().toString().padStart(2, "0")}${(date.getHours() < 12) ? "am" : "pm"}`;
		const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
		const elapsed = (Date.now() - props.time) / 1000;
		if (elapsed < 60) {
			timeText = "now";
		} else if (elapsed < 3600) {
			timeText = Math.floor(elapsed / 60) + "m ago";
		} else if (elapsed < 86400) {
			timeText = Math.floor(elapsed / 3600) + "h ago";
		} else if (elapsed < 86400 * 2) {
			timeText = timeStr + " • yesterday";
		} else {
			timeText = timeStr + " • " + dateStr;
		}

	}

	// Dynamic style
	const postContainerStyle = {
		paddingLeft: props.me ? "40%" : "0%",
		paddingRight: props.me ? "0%" : "40%",
	}
	const msgContainerStyle = {
		marginLeft: props.me ? "auto" : "0px",
		marginRight: props.me ? "0px" : "auto"
	}
	const textContainerStyle = {
		backgroundColor: props.me ? "#DBF0FF" : "#F5F5F5",
		marginLeft: props.me ? "auto" : "0px",
		marginRight: props.me ? "0px" : "auto"
	}
	const userContainerStyle = {
		float: props.me ? "right" : "left"
	}

	// Component
	return (
		<div className="lfeed-post-container" style={postContainerStyle}>
			<div className="lfeed-message-container" style={msgContainerStyle}>
				{(props.time != null)
				? <p className="lfeed-post-timestamp">{timeText}</p>
				: null}
				<div className="lfeed-message-text-container" style={textContainerStyle}>
					<span>{props.text}</span>
				</div>
			</div>
			{(props.user != null)
			? <div className="lfeed-post-user-container" style={userContainerStyle}>
				<ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
			</div>
			: null}
		</div>
	);

}

export default LectureMessage;