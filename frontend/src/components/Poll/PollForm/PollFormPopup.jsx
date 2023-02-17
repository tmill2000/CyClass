import React, { createRef } from "react";
import Popup from 'reactjs-popup';

import './style.css';
import IconPoll from "../IconPoll";
import ProfileIcon from "../../ProfileIcon";

// How to use: <PopUp header="Poll Creation" trigger_button_name="Create Poll" content="INSERT CONTENT" submit_button_name="Post Poll"></PopUp>

export default function PollFormPopup(props){
    const poll_question_input = createRef();
    const poll_answer_A = createRef();
    const poll_answer_B = createRef();
    const poll_answer_C = createRef();
    const poll_answer_D = createRef();
    const poll_duration = createRef();
    const poll_title_entry = createRef();

    return (
        <Popup 
        trigger={<button className="button"> Create Poll </button>}
        modal
        nested
      >
        {close => (
          <div className="popup">
            <button className="close" onClick={close}>&times;</button>
            <div className="header">         
            <div className='poll-form-header-container'>
                <div className='poll-form-header-left-aligned'>
                    <IconPoll></IconPoll>
                    <ProfileIcon profile_name={props.profile_name} profile_role={props.profile_role}></ProfileIcon>
                    <div className='poll-form-header-title'>
                        <div className='poll-form-header-input-label'>Poll Title:</div>
                        <textarea ref={poll_title_entry} className='poll-form-header-input-field'/>
                    </div>
                </div>
            </div>
        </div>
            <ColoredLine color="grey" height="5"/>
            <div className="content">
              {' '}
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
            </div>
            <div className="actions">
              <button className="button"
                onClick={() => {
                  close();
                  getInputs();
                }}>Submit Poll</button>
            </div>
          </div>
        )}
        
      </Popup>
    );
}

function getInputs(){
    console.log("INPUTS FOLLOWING: ");
    const title = poll_title_entry.current.value.trim();
    
    console.log(title);

    const question = poll_question_input.current.value.trim();
    console.log(question);

}


const ColoredLine = ({ color, height }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: height
      }}
  />
);
