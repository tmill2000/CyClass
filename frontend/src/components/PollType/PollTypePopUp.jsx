import React from "react";
import { useNavigate } from "react-router-dom";

import { PopupForm } from "../PopUp";

import "./styles.css";

function PollTypePopUp(props){


    const create = (inputs) => {
		
		//create new multiple choice or select all that apply form
		return props.api.createPoll(poll_question_input.current.value.trim(), get_date(), getInputs(), props.courseID, props.lectureID, 'MULTIPLE_CHOICE')
			.catch((err) => props.onClose());
	};

    return (
		<PopupForm
			title="Poll Form"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="CREATE"
			onSubmit={create}
			inputs={[
				{
					boolean: "Multiple Answers?", // go with true at the moment 
                    label: "Poll Title",
					name: "title",
					type: "text",
					validator: (input) => input != ""
				}
			]} />
	);

}