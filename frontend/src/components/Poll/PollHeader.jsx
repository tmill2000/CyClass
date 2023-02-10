import React from "react";

import IconPoll from './IconPoll';
import ProfileIcon from '../../components/ProfileIcon';

import './style.css';

function PollHeader(props){
    return(
        <div className='poll-header-container'>
            <div className='poll-header-left-aligned'>
                <IconPoll></IconPoll>
                <div className='poll-header-title'>{props.title}</div>
                <ProfileIcon profile_name={props.profile_name} profile_role={props.roll}></ProfileIcon>
            </div>
        </div>
    );
}

export default PollHeader;