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
		if (props.api != null && props.courseID != null && props.lectureID != null)  {
			props.api.createPoll(poll_question_input.current.value.trim(), get_date(), getInputs(), props.courseID, props.lectureID, 'MULTIPLE_CHOICE');
		}
	};

    function get_date(){
        var date = new Date();
        const time_elapsed = document.getElementById('numMins');
        time_elapsed = time_elapsed.current.trim();
        console.log(time_elapsed);
        let updated_mins = date.getMinutes() + time_elapsed;
        let add_mins = updated_mins % 60;
        console.log(updated_mins);
        updated_mins = updated_mins - add_mins * 60;
        console.log(updated_mins);
        let updated_hours = date.getHours() + add_mins;
        console.log(updated_hours);
        date.setHours(updated_hours);
        date.setMinutes(updated_mins);
        console.log(date); // Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time) 
        
        // return date.toISOString();
        return null;
    }

    function backgroundColor(letter){
        const btnA = document.getElementById('buttonA');
        const entryA = document.getElementById('entryA');
        const btnB = document.getElementById('buttonB');
        const entryB = document.getElementById('entryB');
        const btnC = document.getElementById('buttonC');
        const entryC = document.getElementById('entryC');
        const btnD = document.getElementById('buttonD');
        const entryD = document.getElementById('entryD');
        if (letter === 'A'){
            btnA.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
            entryA.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
            pollA = true;
            pollB = false;
            pollC = false;
            pollD = false;
            btnB.style.backgroundColor = 'white';
            entryB.style.backgroundColor = 'white';
            btnC.style.backgroundColor = 'white';
            entryC.style.backgroundColor = 'white';
            btnD.style.backgroundColor = 'white';
            entryD.style.backgroundColor = 'white';
        }
        else if (letter === 'B'){
            btnB.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
            entryB.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
            pollB = true;
            pollA = false;
            pollC = false;
            pollD = false;
            btnA.style.backgroundColor = 'white';
            entryA.style.backgroundColor = 'white';
            btnC.style.backgroundColor = 'white';
            entryC.style.backgroundColor = 'white';
            btnD.style.backgroundColor = 'white';
            entryD.style.backgroundColor = 'white';
        }
        else if (letter === 'C'){
            btnC.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
            entryC.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
            pollC = true;
            pollB = false;
            pollA = false;
            pollD = false;
            btnB.style.backgroundColor = 'white';
            entryB.style.backgroundColor = 'white';
            btnA.style.backgroundColor = 'white';
            entryA.style.backgroundColor = 'white';
            btnD.style.backgroundColor = 'white';
            entryD.style.backgroundColor = 'white';
        }
        else if (letter == 'D') {
            btnD.style.backgroundColor = 'rgba(32, 197, 32, 0.826)';
            entryD.style.backgroundColor = 'rgba(117, 241, 117, 0.712)';
            pollD = true;
            pollB = false;
            pollC = false;
            pollA = false;
            btnB.style.backgroundColor = 'white';
            entryB.style.backgroundColor = 'white';
            btnC.style.backgroundColor = 'white';
            entryC.style.backgroundColor = 'white';
            btnA.style.backgroundColor = 'white';
            entryA.style.backgroundColor = 'white';
        }
    }

    function backgroundColorA(){
        backgroundColor('A');
    }

    function backgroundColorB(){
        backgroundColor('B');
    }

    function backgroundColorC(){
        backgroundColor('C');
    }

    function backgroundColorD(){
        backgroundColor('D');
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
          <div className="poll-popup">
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
                        <input ref={poll_answer_A} className="poll-form-individual-answer-entry" id="entryA"/>
                        <button className="poll-form-individual-answer-label" id="buttonB" onClick={backgroundColorB}> B </button>
                        <input ref={poll_answer_B} className="poll-form-individual-answer-entry" id="entryB"/>
                    </div>
                    <div className="poll-form-answer-group">
                        <button className="poll-form-individual-answer-label" id="buttonC" onClick={backgroundColorC}> C </button>
                        <input ref={poll_answer_C} className="poll-form-individual-answer-entry" id="entryC"/>
                        <button className="poll-form-individual-answer-label" id="buttonD" onClick={backgroundColorD}> D </button>
                        <input ref={poll_answer_D} className="poll-form-individual-answer-entry" id="entryD"/>
                    </div>
                </div>
                <div className="poll-form-time-available-group">
                    <div className="poll-form-time-available-label">Number of minutes poll is available: </div>
                    <input ref={poll_duration} className="poll-form-time-available-input" type="number" required id="numMins"/>
                </div>
            </div>
            </div>
            <div className="actions">
              <button className="button-LLLM-new-post"
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
