/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	02/05/2023
 */

import React from "react";

import "./styles.css";

function pmod(x, y) {
	return ((x % y) + y) % y;
}

function TimeLabel(props) {

	// Return blank if time wasn't specified
	if (props.time == null) {
		return null;
	}

	// Compute elapsed time from now (in seconds)
	const date = new Date();
	date.setTime(props.time);
	const elapsed = (Date.now() - props.time) / 1000;

	// Set relative text
	let timeText;
	if (elapsed < 60) {
		timeText = "now";
	} else if (elapsed < 3600) {
		timeText = Math.floor(elapsed / 60) + "m ago";
	} else if (elapsed < 86400) {
		timeText = Math.floor(elapsed / 3600) + "h ago";
	} else {
		const timeStr = `${pmod(date.getHours() - 1, 12) + 1}:${date.getMinutes().toString().padStart(2, "0")}${(date.getHours() < 12) ? "am" : "pm"}`;
		if (elapsed < 86400 * 2) {
			timeText = timeStr + " • yesterday";
		} else {
			const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
			timeText = timeStr + " • " + dateStr;
		}
	}

	// Component
	return (
		<p className="post-timestamp">{timeText}</p>
	);

}

export default TimeLabel;