/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/15/2023
 * UPDATED:	04/15/2023
*/

import React, { createRef, useEffect, useRef } from "react";

import "./styles.css";

function Toast(props) {

	// Define state
	const shown = useRef(false);
	const elementID = `toast${props.id}`;
	useEffect(() => {

		// Show
		if (!shown.current) {
			setTimeout(() => document.getElementById(elementID).style.filter = "opacity(100%)", 1);
			shown.current = true;
		}

		// Fade out after configured show time (restarting on cancel)
		let timer = setTimeout(() => {
			document.getElementById(elementID).style.filter = "opacity(0%)";
			timer = setTimeout(props.onRemove, 1000);
		}, props.showTime * 1000);
		return () => clearTimeout(timer);

	}, []);

	// Component
	return (
		<div id={elementID} className="toast" style={{
				bottom: props.offsetY,
				filter: shown.current ? "opacity(100%)" : "opacity(0%)",
				color: props.textColor,
				backgroundColor: props.backColor
			}}>
			{props.children}
		</div>
	);

}

export default Toast;