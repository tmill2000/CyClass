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
        </div>
    );
}

export default PollFormBody;