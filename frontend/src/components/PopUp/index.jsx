/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/05/2023
 * UPDATED:	04/05/2023
*/

import React, { createRef, useEffect, useRef } from "react";

import { showErrorToast } from "../Toast";

import "./styles.css";

export default function Popup(props) {

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
				popup.style.backgroundColor = "#0004";
				popup.children[0].style.height = "90%";
			}, 0);
			return () => clearTimeout(timer);

		} else {

			// Hide with transition
			popup.style.backdropFilter = "blur(0px)";
			popup.style.backgroundColor = "#0000";
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
			<div style={{maxWidth: props.maxWidth}}>
				<div className="header">
					<span className="title">{props.title}</span>
					<button className="close button" onClick={props.onClose}>X</button>
				</div>
				<div className="header-line" />
				<div className="content">
					{props.children}
				</div>
			</div>
		</div>
	);

}

export function PopupForm(props) {

	// Input element generation
	const inputElements = [];
	for (const input of props.inputs) {

		// Make actual input element based on type
		const inputRef = createRef();
		const inputRef2 = createRef();
		let mainInput = null;
		let getter = null;
		let clearer = null;
		switch (input.type) {
			case "text":
				mainInput = <input ref={inputRef} type="text" onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.value.trim();
				clearer = () => inputRef.current.value = "";
				break;
			case "paragraph":
				mainInput = <textarea ref={inputRef} onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.value.trim();
				clearer = () => inputRef.current.value = "";
				break;
			case "boolean":
				mainInput = <input ref={inputRef} type="checkbox" onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.checked;
				clearer = () => inputRef.current.checked = false;
				break;
			case "booleanOnClick":
				mainInput = <input ref={inputRef} type="checkbox" onChange={input.change_method}/>;
				getter = () => inputRef.current.checked;
				clearer = () => inputRef.current.checked = false;
				break;
			case "answerBlock":
				mainInput = <div>
								<button id={input.name} ref={inputRef2} onClick={input.change_method}>{input.change}</button>
								<input ref={inputRef} className="poll-form-individual-answer-entry" id={input.name2}/>
							</div>
				getter = () => [{text: inputRef.current.value.trim(), correct: input.change == "Correct" ? true: false}];
				clearer = () => inputRef.current.value = "";
				break;
			case "spinner":
				mainInput = <input ref={inputRef} type="number" id={input.name}/>
				getter = () => inputRef.current.value.trim();
				clearer = () => inputRef.current.value = "";
				break;
			case "password":
				mainInput = <input ref={inputRef} type="password" onChange={(e) => e.target.className = ""}/>;
				getter = () => inputRef.current.value.trim();
				clearer = () => inputRef.current.value = "";
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
			clear: () => inputRef.current.value = "",
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
				.then(() => {
					if (props.enabled) {
						try {
							for (const input of inputElements) {
								input.clear();
							}
						} catch (err) {
							console.log("Failed to clear input elements", err);
						}
						props.onClose();
					}
				})
				.catch((err) => {
					showErrorToast(`Form failed: ${err.message}`);
					console.log(err);
				})
				.finally(() => canSubmit.current = true);
		}

	};

	// Component
	return (
		<Popup title={props.title} enabled={props.enabled} onClose={props.onClose} maxWidth="1000px">
			<div className="form">
				{inputElements.map(x => x.element)}
				<button className="submit button" onClick={submit}>{props.submitText ?? "SUBMIT"}</button>
			</div>
		</Popup>
	);

}