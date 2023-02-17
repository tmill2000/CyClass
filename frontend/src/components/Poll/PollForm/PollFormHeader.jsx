import React, { createRef } from "react";
import IconPoll from '../IconPoll';
import ProfileIcon from '../../ProfileIcon';

import './style.css';

function PollFormHeader(props){
    return(
        <div className='poll-form-header-container'>
            <div className='poll-form-header-left-aligned'>
                <IconPoll></IconPoll>
                <ProfileIcon profile_name={props.profile_name} profile_role={props.profile_role}></ProfileIcon>
                <div className='poll-form-header-title'>
                    <div className='poll-form-header-input-label'>Poll Title:</div>
                    <input className='poll-form-header-input-field'></input>
                </div>
            </div>
        </div>
    );
}

export default PollFormHeader;