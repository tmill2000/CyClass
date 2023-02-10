import React from "react";
import {Circle} from 'react-shapes';

import './style.css';

function IconPoll(){
    return(
        <div className='poll-icon-container'>
            <Circle></Circle>
            <div className='poll-icon-label'>Poll</div>
        </div>
    );
}


export default IconPoll;