/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	02/16/2023
 */

import React from "react";

import "./styles.css";

function TimeLabel(props) {

	// Return blank if time wasn't specified
	if (props.time == null) {
		return null;
	}

	// Component
	return (
		<p className="post-timestamp" debugts={props.time.toISOString()}>{props.time.toRelativeString()}</p>
	);

}

export default TimeLabel;