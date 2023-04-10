import React, { useEffect, useState } from "react";
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
	// const correctA = false;
	// const correctB = false;
	// const correctC = false;
	// const correctD = false;
	const [correctA, setCorrectA] = useState(false);
	const [correctB, setCorrectB] = useState(false);
	const [correctC, setCorrectC] = useState(false);
	const [correctD, setCorrectD] = useState(false);

	// const correct_list = [correctA, correctB, correctC, correctD]
	const correct_list = [
		[correctA, setCorrectA], 
		[correctB, setCorrectB], 
		[correctC, setCorrectC], 
		[correctD, setCorrectD]];

	const multiple_choice = true;

	const element_names = [
		["A_answer_button", "A_answer_input"],
		["B_answer_button", "B_answer_input"],
		["C_answer_button", "C_answer_input"],
		["D_answer_button", "D_answer_input"]]

	function change_method(button_element, input_element, bool_letter, setBool){
		if (multiple_choice){
			change_multiple_choice(button_element, input_element, bool_letter, setBool)
		}

	}

	function change_multiple_choice(button_element, input_element, bool_letter, setBool){
		// bool_letter = setBool(!bool_letter); //switch to right "correctness"

		return;
		// if (bool_letter){ // answer is now true/correct
		// 	for (let i = 0; i < 4; i++){
		// 		correct_list[i] = !correct_list[i];
		// 		let button_curr = document.getElementById(element_names[i][0]);
		// 		let input_curr = document.getElementById(element_names[i][1]);
		// 		button_curr.style.backgroundColor = 'white';
		// 		input_curr.style.backgroundColor = 'white';
		// 	}
		// 	let button_curr = document.getElementById(button_element);
		// 	let input_curr = document.getElementById(input_element);
		// 	button_curr.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
		// 	input_curr.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
		// }
		// else { // answer is now false 
		// 	let button_curr = document.getElementById(button_element);
		// 	let input_curr = document.getElementById(input_element);
		// 	button_curr.style.backgroundColor = 'white';
		// 	input_curr.style.backgroundColor = 'white';
		// }
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
					label: "Answer A",
					name: "A_answer_button",
					name2: "A_answer_input",
					type: "answerBlock",
					change: correctA ? "Correct" : "Incorrect",
					change_method: change_method("A_answer_button", "A_answer_input", correctA, setCorrectA)
				},
				{
					label: "Answer B",
					name: "B_answer_button",
					name2: "B_answer_input",
					type: "answerBlock",
					change: correctB ? "Correct" : "Incorrect",
					change_method: change_method("B_answer_button", "B_answer_input", correctB, setCorrectB)
				},
				{
					label: "Answer C",
					name: "C_answer_button",
					name2: "C_answer_input",
					type: "answerBlock",
					change: correctC ? "Correct" : "Incorrect",
					change_method: change_method("C_answer_button", "C_answer_input", correctC, setCorrectC)
				},
				{
					label: "Answer D",
					name: "D_answer_button",
					name2: "D_answer_input",
					type: "answerBlock",
					validator: (input) => input != "",
					change: correctD ? "Correct" : "Incorrect",
					change_method: change_method("D_answer_button", "D_answer_input", correctD, setCorrectD)
				}
			]} />
	);

}

export default PollTypePopUp;