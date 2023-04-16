/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/15/2023
 * UPDATED:	04/15/2023
*/

import React, { useEffect, useState } from "react";

import Toast from "./Toast";
import "./styles.css";

const toastEventTarget = new EventTarget();

class ToastEvent extends Event {
	constructor(msg, showTime, textColor, backColor) {
		super("toast");
		this.msg = msg;
		this.showTime = showTime;
		this.textColor = textColor;
		this.backColor = backColor;
	}
}

let toasts = [];
let nextToastID = 0;
let toastVersion = 0;

function ToastContainer(props) {

	// Hooks
	const [_, setToastVersion] = useState(toastVersion); // (hack to force re-render of global state)

	// Handlers
	const removeToast = (id) => {

		// Find index and remove
		const index = toasts.findIndex(x => x.id == id);
		if (index >= 0) {
			toasts[index] = toasts[toasts.length - 1];
			toasts.pop();
			setToastVersion(++toastVersion);
		}

	};

	// Begin listening for toast events
	useEffect(() => {
		const toastEventHandler = (e) => {

			// Add toast spec to state (at front = at bottom of stack)
			toasts = [{
				id: nextToastID++,
				event: e,
				stackPos: 0
			}, ...toasts];

			// Move everything else up one
			for (let i = 1; i < toasts.length; i++) {
				toasts[i].stackPos += 1;
			}
			setToastVersion(++toastVersion);

		};
		toastEventTarget.addEventListener("toast", toastEventHandler);
		return () => toastEventTarget.removeEventListener("toast", toastEventHandler);
	}, []);

	// Component
	return (
		<div className="toast-container">
			{toasts.map((x) => <Toast
				key={x.id}
				id={x.id}
				showTime={x.event.showTime}
				textColor={x.event.textColor}
				backColor={x.event.backColor}
				offsetY={`calc(${x.stackPos}em + ${x.stackPos * 30}px)`}
				onRemove={() => removeToast(x.id)}>
					{x.event.msg}
			</Toast>)}
		</div>
	);

};

/**
 * Shows the specified toast message with the specified configuration. If not specified, will default to show the
 * message for 5 seconds with black text on a light-gray background.
 * @param {string} msg 
 * @param {number?} showTime
 * @param {string?} textColor 
 * @param {string?} backColor 
 */
function showToast(msg, showTime, textColor, backColor) {

	// Emit event
	toastEventTarget.dispatchEvent(new ToastEvent(msg, showTime || 5, textColor || "#000000", backColor || "#D8D8D8"))

}

/**
 * Special sub-form of {@link showToast} that displays the provided message in the standard Toast error format.
 * @param {string} errorMessage 
 */
function showErrorToast(errorMessage) {

	// Show with red back
	showToast(errorMessage, 5, "#FFF", "#C00");

}

export default ToastContainer;
export {
	showToast,
	showErrorToast
};