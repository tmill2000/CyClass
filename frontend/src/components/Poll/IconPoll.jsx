import React from "react";
import {Circle} from 'react-shapes';

import './style.css';

function IconPoll(){
    return(
        <div className='poll-icon-container'>
            <Circle r={7} fill={{color: 'rgb(137, 135, 135)'}} stroke={{color:'black'}} strokeWidth={1} />
            <div className='poll-icon-label'>Poll</div>
        </div>
    );
}


export default IconPoll;