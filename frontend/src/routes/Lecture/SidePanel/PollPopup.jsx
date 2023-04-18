import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PopupForm } from "../../../components/PopUp";

// import "./styles.css";

function PollTypePopUp(props){


    const create = (inputs) => {
		let poll_question = inputs.title;
		let close_date = get_date(inputs);

		let options = get_options(inputs.A_answer_button, inputs.B_answer_button, inputs.C_answer_button, inputs.D_answer_button);
		
		let pollType = 'MULTIPLE_SELECT';
		if (!multipleAnswers){
			pollType = 'MULTIPLE_CHOICE';
		}
		return props.api.createPoll(poll_question, close_date, options, props.courseID, props.lectureID, pollType);
	};

	function get_date(inputs){
		if (inputs.numMins > 0) {
			let date = new Date(new Date().getTime() + inputs.numMins * 60 * 1000);
			return date;
		} else {
			return null;
		}
    }

	const get_options = (A, B, C, D) => {
		const some = [A, B, C, D];
		const message = [];
		for (let i =0; i < 4; i++){
			let something = some[i][0];
			if (something.text.trim() != "") {
				message.push({
					text: something.text,
					correct: something.correct
				});
			}
        }
		return message;
	}

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

	const [multipleAnswers, setMultipleAnswers] = useState(false);

	const element_names = [
		["A_answer_button", "A_answer_input"],
		["B_answer_button", "B_answer_input"],
		["C_answer_button", "C_answer_input"],
		["D_answer_button", "D_answer_input"]]


	function change_num_answers(){
		let ma = !multipleAnswers
		setMultipleAnswers(ma);

		if (!ma){
			for (let i = 0; i < 4; i++){
				let setBoolean = correct_list[i][1];
				setBoolean(false);
				let button_curr = document.getElementById(element_names[i][0]);
				let input_curr = document.getElementById(element_names[i][1]);
				button_curr.style.backgroundColor = 'white';
				input_curr.style.backgroundColor = 'white';
			}
		}
	}

	function change_method(button_element, input_element, bool_letter, setBool){
		if (multipleAnswers){
			change_multiple_select(button_element, input_element, bool_letter, setBool);
		}
		else{
			change_multiple_choice(button_element, input_element, bool_letter, setBool);
		}
	}


	function change_multiple_choice(button_element, input_element, bool_letter, setBool){
		bool_letter = !bool_letter;//switch to right "correctness"
		
		if (bool_letter){ // answer is now true/correct
			for (let i = 0; i < 4; i++){
				let setBoolean = correct_list[i][1];
				setBoolean(false);
				let button_curr = document.getElementById(element_names[i][0]);
				let input_curr = document.getElementById(element_names[i][1]);
				button_curr.style.backgroundColor = 'white';
				input_curr.style.backgroundColor = 'white';
			}
			let button_curr = document.getElementById(button_element);
			let input_curr = document.getElementById(input_element);
			button_curr.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
			input_curr.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
		}
		else { // answer is now false 
			let button_curr = document.getElementById(button_element);
			let input_curr = document.getElementById(input_element);
			button_curr.style.backgroundColor = 'white';
			input_curr.style.backgroundColor = 'white';
		}
		setBool(bool_letter);
	}
	
	function change_multiple_select(button_element, input_element, bool_letter, setBool){
		bool_letter = !bool_letter;//switch to right "correctness"
		setBool(bool_letter);
		if (bool_letter){ // answer is now true/correct
			let button_curr = document.getElementById(button_element);
			let input_curr = document.getElementById(input_element);
			button_curr.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
			input_curr.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
		}
		else { // answer is now false 
			let button_curr = document.getElementById(button_element);
			let input_curr = document.getElementById(input_element);
			button_curr.style.backgroundColor = 'white';
			input_curr.style.backgroundColor = 'white';
		}
		setBool(bool_letter);
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
					type: "booleanOnClick",
					change_method: () => change_num_answers()
				},
				{
					label: "Answer A",
					name: "A_answer_button",
					name2: "A_answer_input",
					type: "answerBlock",
					change: correctA ? "Correct" : "Incorrect",
					change_method: () => change_method("A_answer_button", "A_answer_input", correctA, setCorrectA)
				},
				{
					label: "Answer B",
					name: "B_answer_button",
					name2: "B_answer_input",
					type: "answerBlock",
					change: correctB ? "Correct" : "Incorrect",
					change_method: () => change_method("B_answer_button", "B_answer_input", correctB, setCorrectB)
				},
				{
					label: "Answer C",
					name: "C_answer_button",
					name2: "C_answer_input",
					type: "answerBlock",
					change: correctC ? "Correct" : "Incorrect",
					change_method: () => change_method("C_answer_button", "C_answer_input", correctC, setCorrectC)
				},
				{
					label: "Answer D",
					name: "D_answer_button",
					name2: "D_answer_input",
					type: "answerBlock",
					change: correctD ? "Correct" : "Incorrect",
					change_method: () => change_method("D_answer_button", "D_answer_input", correctD, setCorrectD)
				},
				{
					label: "Number of minutes to keep the poll open: ",
					name: "numMins",
					type: "spinner"
				}
			]} />
	);

}

export default PollTypePopUp;