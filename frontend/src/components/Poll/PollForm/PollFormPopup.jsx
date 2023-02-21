import React, { createRef } from "react";
import Popup from 'reactjs-popup';

import './style.css';
import './style_popup.css';
import IconPoll from "../IconPoll";
import ProfileIcon from "../../ProfileIcon";


export default function PollFormPopup(props){
    const poll_question_input = createRef();
    const poll_answer_A = createRef();
    const poll_answer_B = createRef();
    const poll_answer_C = createRef();
    const poll_answer_D = createRef();
    const poll_duration = createRef();
    let pollA = false;
    let pollB = false;
    let pollC = false;
    let pollD = false;

    const onSelect = () => {
		if (props.api != null ) {
<<<<<<< HEAD
			props.api.createPoll(poll_question_input.current.value.trim(), null, getInputs());
=======
			props.api.createPoll(poll_question_input.current.value.trim(), 10, getInputs());
>>>>>>> master
		}
	};

    function backgroundColorA(){
        const btnA = document.getElementById('buttonA');
        if (btnA.style.backgroundColor === 'white' || btnA.style.backgroundColor === '' ){
            btnA.style.backgroundColor = 'green';
            pollA = true;
        }
        else{
            btnA.style.backgroundColor = 'white';
            pollA = false;
        }
    }

    function backgroundColorB(){
        const btnB = document.getElementById('buttonB');
        if (btnB.style.backgroundColor === 'white' || btnB.style.backgroundColor === ''){
            btnB.style.backgroundColor = 'green';
            pollB = true;
        }
        else{
            btnB.style.backgroundColor = 'white';
            pollB = false;
        }
    }

    function backgroundColorC(){
        const btnC = document.getElementById('buttonC');
        if (btnC.style.backgroundColor === 'white' || btnC.style.backgroundColor === ''){
            btnC.style.backgroundColor = 'green';
            pollC = true;
        }
        else{
            btnC.style.backgroundColor = 'white';
            pollC = false;
        }
    }

    function backgroundColorD(){
        const btnD = document.getElementById('buttonD');
        if (btnD.style.backgroundColor === 'white' || btnD.style.backgroundColor === ''){
            btnD.style.backgroundColor = 'green';
            pollD = true;
        }
        else{
            btnD.style.backgroundColor = 'white';
            pollD = false;
        }
    }


    const getInputs = () => {
        const some = [poll_answer_A, poll_answer_B, poll_answer_C, poll_answer_D];
        const correct = [pollA, pollB, pollC, pollD];
        let message = [];
        for (let i =0; i < 4; i++){
            if (some[i].current.value.trim() != ''){
                message.push({
                    text: some[i].current.value.trim(),
                    correct: correct[i]
                });
            }
        }
        return message;
    }

    return (
        <Popup 
        trigger={<button className="button-LLLM-new-post">NEW POLL</button>}
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
                            <div className='poll-form-header-input-label'>Poll Question:</div>
                            <textarea ref={poll_question_input} className='poll-form-header-input-field'/>
                        </div>
                    </div>
                </div>
            </div>
            <ColoredLine color="grey" height="5"/>
            <div className="content">
              {' '}
              <div>
                <div className="poll-form-answer-entry-group">
                    <div className="poll-form-answer-label">Enter in your answer choices: </div>
                    <div className="poll-form-answer-group">
                        <button className="poll-form-individual-answer-label" id="buttonA" onClick={backgroundColorA}> A </button>
                        <input ref={poll_answer_A} className="poll-form-individual-answer-entry"/>
                        <button className="poll-form-individual-answer-label" id="buttonB" onClick={backgroundColorB}> B </button>
                        <input ref={poll_answer_B} className="poll-form-individual-answer-entry"/>
                    </div>
                    <div className="poll-form-answer-group">
                        <button className="poll-form-individual-answer-label" id="buttonC" onClick={backgroundColorC}> C </button>
                        <input ref={poll_answer_C} className="poll-form-individual-answer-entry"/>
                        <button className="poll-form-individual-answer-label" id="buttonD" onClick={backgroundColorD}> D </button>
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
                  onSelect();
                }}>Submit Poll</button>
            </div>
          </div>
        )}
        
      </Popup>
    );
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
