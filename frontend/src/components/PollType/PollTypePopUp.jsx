import React from "react";
import { useNavigate } from "react-router-dom";

import { PopupForm } from "../PopUp";

// import "./styles.css";

function PollTypePopUp(props){


    const create = (inputs) => {
		let poll_question = inputs.title.current.value.trim();
		console.log("CCCCCCCCCCCCCCCCCCC");
		console.log(poll_question);
		let close_date = get_date();
		let options = get_options(inputs.A_answer_input, inputs.B_answer_input, inputs.C_answer_input, inputs.D_answer_input);
		//create new multiple choice or select all that apply form
		return props.api.createPoll(poll_question, close_date, options, props.courseID, props.lectureID, 'MULTIPLE_CHOICE')
			.catch((err) => props.onClose());
	};

	const get_options = (A, B, C, D) => {
		some = [A, B, C, D]
		let message = [];
		for (let i =0; i < 4; i++){
            // if (some[i].current.value.trim() != ''){
            //     message.push({
            //         text: some[i].current.value.trim(),
            //         correct: correct[i]
            //     });
            // }
        }
		return message;
	}

    return (
		<PopupForm
			title="Poll Form"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="CREATE"
			onSubmit={create}
			inputs={[
				{ 
                    label: "Poll Title",
					name: "title",
					type: "text",
					validator: (input) => input != ""
				},
				{
					label: "Multiple Answers?",  //assume only 1 correct answer for now
					name: "num_correct_answers",
					type: "boolean",
					validator: (input) => input != ""
				},
				{
					label: "Answer1",
					name: "A_answer_button",
					name2: "A_answer_input",
					letter: "A",
					type: "answerBlock"
					// validator: (input) => input
				},
				{
					label: "Answer2",
					name: "B_answer_button",
					name2: "B_answer_input",
					letter: "B",
					type: "answerBlock"
					// validator: (input) => input
				},
				{
					label: "Answer3",
					name: "C_answer_button",
					name2: "C_answer_input",
					letter: "C",
					type: "answerBlock"
					// validator: (input) => input
				},
				{
					label: "Answer4",
					name: "D_answer_button",
					name2: "D_answer_input",
					letter: "D",
					type: "answerBlock"
					// validator: (input) => input
				}
			]} />
	);

}

export default PollTypePopUp;