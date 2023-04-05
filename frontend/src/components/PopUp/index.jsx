/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/05/2023
 * UPDATED:	04/05/2023
*/

import React, { createRef, useEffect, useRef } from "react";

import "./styles.css";

export default function PopUp(props) {

	// Effect
	const popupRef = createRef();
	useEffect(() => {

		// Get pop-up
		const popup = popupRef.current;

		// Check if visible
		if (props.enabled) {

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

	}, [ props.enabled ]);

	// Component
	return (
		<div ref={popupRef} className="popup" style={{display: "none"}}>
			<div>
				<div className="header">
					<span className="title">{props.title}</span>
					<button className="close button" onClick={props.onClose}>X</button>
				</div>
				<div className="header-line" />
				<div>
					{props.children}
				</div>
			</div>
		</div>
	);

}

export function PopUpForm(props) {

	// Input element generation
	const inputElements = [];
	for (const input of props.inputs) {

		// Make actual input element based on type
		const inputRef = createRef();
		let mainInput = null;
		let getter = null;
		switch (input.type) {
			case "text":
				mainInput = <input ref={inputRef} type="text" onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.value.trim();
				break;
			case "paragraph":
				mainInput = <textarea ref={inputRef} onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.value.trim();
				break;
			case "boolean":
				mainInput = <input ref={inputRef} type="checkbox" onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.checked;
				break;
			default:
				throw new Error(`Unrecognized input type: ${x.type}`);
		}

		// Add full element to list
		inputElements.push({
			element: (
				<div key={input.name} className="input-container">
					<div className="label">
						<span>{input.label}</span>
					</div>
					{mainInput}
				</div>
			),
			config: input,
			get: getter,
			setInvalid: () => inputRef.current.className = "invalid"
		});

	}

	// Submit handler
	const canSubmit = useRef(true);
	const submit = () => {

		// Do nothing if can't submit
		if (!canSubmit.current) {
			return;
		}

		// Collect inputs, validating each if a validator exists
		const inputs = {};
		let allValid = true;
		for (const input of inputElements) {
			const value = input.get();
			inputs[input.config.name] = value;
			if (input.config.validator != null && !input.config.validator(value)) {
				input.setInvalid();
				allValid = false;
			}
		}

		// If all valid, submit
		if (allValid) {
			canSubmit.current = false;
			Promise.resolve(props.onSubmit(inputs))
				.then(() => props.onClose())
				.finally(() => canSubmit.current = true);
		}

	};

	// Component
	return (
		<PopUp title={props.title} enabled={props.enabled} onClose={props.onClose}>
			<div className="form">
				{inputElements.map(x => x.element)}
				<button className="submit button" onClick={submit}>{props.submitText ?? "SUBMIT"}</button>
			</div>
		</PopUp>
	);

}