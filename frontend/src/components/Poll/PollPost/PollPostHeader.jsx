import React from "react";

import IconPoll from '../IconPoll';
import ProfileIcon from '../../ProfileIcon';
import DateTimeStamp from '../../DateTime/DateTimeStamp';

import './style.css';

function PollPostHeader(props){
    return(
        <div className='poll-post-header-container'>
            <div className='poll-post-header-left-aligned'>
                <IconPoll></IconPoll>
                <div className='poll-post-header-title'>{props.title}</div>
                <ProfileIcon profile_name={props.profile_name} profile_role={props.profile_role}></ProfileIcon>
            </div>
            <div className="poll-post-header-right-aligned">
                <DateTimeStamp></DateTimeStamp>
            </div>
        </div>
    );
}

export default PollPostHeader;