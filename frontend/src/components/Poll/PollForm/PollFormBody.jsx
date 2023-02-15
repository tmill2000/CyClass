import React from "react";
import InputField from "../../../routes/Login/InputField";

function PollFormBody(){
    return(
        <div>
            <div className="poll-form-question-field">
                <div className="poll-form-question-input-label">Poll Question:</div>
                <div className="poll-form-question-input-field">
                    <InputField></InputField>
                </div>
            </div>
            <div className="poll-form-answer-entry-group">
                <div className="poll-form-answer-label">Enter in your answer choices: </div>
                <div className="poll-form-answer-group">
                    <text className="poll-form-individual-answer-label"> A </text>
                    <input className="poll-form-individual-answer-entry"></input>
                    <text className="poll-form-individual-answer-label"> B </text>
                    <input className="poll-form-individual-answer-entry"></input>
                </div>
                <div className="poll-form-answer-group">
                    <text className="poll-form-individual-answer-label"> C </text>
                    <input className="poll-form-individual-answer-entry"></input>
                    <text className="poll-form-individual-answer-label"> D </text>
                    <input className="poll-form-individual-answer-entry"></input>
                </div>
            </div>
        </div>
    );
}

export default PollFormBody;