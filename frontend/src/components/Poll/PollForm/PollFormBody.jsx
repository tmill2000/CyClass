import React, { createRef } from "react";

function PollFormBody(){
    const poll_question_input = createRef();
    const poll_answer_A = createRef();
    const poll_answer_B = createRef();
    const poll_answer_C = createRef();
    const poll_answer_D = createRef();
    const poll_duration = createRef();

    return(
        <div>
            <div className="poll-form-question-field">
                <div className="poll-form-question-input-label">Poll Question:</div>
                <input ref={poll_question_input} className="poll-form-question-input-field"/>
            </div>
            <div className="poll-form-answer-entry-group">
                <div className="poll-form-answer-label">Enter in your answer choices: </div>
                <div className="poll-form-answer-group">
                    <div className="poll-form-individual-answer-label"> A </div>
                    <input ref={poll_answer_A} className="poll-form-individual-answer-entry"/>
                    <div className="poll-form-individual-answer-label"> B </div>
                    <input ref={poll_answer_B} className="poll-form-individual-answer-entry"/>
                </div>
                <div className="poll-form-answer-group">
                    <div className="poll-form-individual-answer-label"> C </div>
                    <input ref={poll_answer_C} className="poll-form-individual-answer-entry"/>
                    <div className="poll-form-individual-answer-label"> D </div>
                    <input ref={poll_answer_D} className="poll-form-individual-answer-entry"/>
                </div>
            </div>
            <div className="poll-form-time-available-group">
                <div className="poll-form-time-available-label">Number of minutes poll is available: </div>
                <input ref={poll_duration} className="poll-form-time-available-input" type="number" required/>
            </div>
        </div>
    );
}

export default PollFormBody;

