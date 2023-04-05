/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/05/2023
 * UPDATED:	04/05/2023
*/

import React from "react";

import Question from "./Question";
import "./styles.css";

export default function QuestionFeed(props) {

	// Component
	return (
		<div className="qfeed" style={{display: props.questions.length == 0 ? "none" : null}}>
			<span className="title">Live Questions</span>
			<div className="list">
				{props.questions.map(x => <Question key={x.id.toString()} api={props.api} question={x.question} user={x.user} />)}
			</div>
			<div className="back" />
		</div>
	)

}