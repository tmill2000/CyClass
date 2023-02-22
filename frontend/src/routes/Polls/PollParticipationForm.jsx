/**
 * AUTHOR:	Brandon Burt
 * CREATED:	02/05/2023
 * UPDATED:	02/11/2023
 */
 import React from 'react';
 import "./styles.css";
 import ParticipantPill from './ParticipantPill';
 import { Link } from "react-router-dom";


 function ParticipationForm (props) {

	// Component
	return (
        <div className="white-container">
        <div style={{float:'left', width: '50%'}}>
           <div className="header" style={{fontWeight:'bold', fontSize:'27px', fontFamily:'Arial', paddingLeft:'15px', paddingTop:'9px',float:'left'}}>Poll Participation</div>
           <div style={{fontWeight: 'bold', fontFamily: 'Arial', color: 'gray', textAlign: 'left', paddingTop: '47px', paddingLeft: '15px'}}>329 participants</div>
        </div>
      <Link to="/lecture">
        <div style={{float: 'right', paddingTop: '7px', width: '35px'}}>
           <a href="#" class="close-button">
              <div class="in">
                 <div class="close-button-block"></div>
                 <div class="close-button-block"></div>
              </div>
              <div class="out">
                 <div class="close-button-block"></div>
                 <div class="close-button-block"></div>
              </div>
           </a>
        </div>
       </Link>
        <div style={{paddingTop: '82px'}}>
           <div style={{borderTop: '1px solid gray'}}></div>
        </div>
        <div style={{paddingLeft: '160px'}}>
         <ParticipantPill profile_name={props.me ? "You" : props.user.name}></ParticipantPill>
        </div>
     </div>
	);

}

export default ParticipationForm;