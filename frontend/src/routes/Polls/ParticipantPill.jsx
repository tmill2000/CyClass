/**
 * AUTHOR:	Brandon Burt
 * CREATED:	02/11/2023
 * UPDATED:	02/12/2023
 */
 import React from 'react';
 import "./styles.css";


 function ParticipantPill (props) {

	// Component
	return (
		<div style="padding-top: 50px; padding-left: 30px;">
    	 	<div style="border-style: groove; background-color: #ededed; width: 510px; height: 60px;">
          		<div style="float: right; padding-top: 20px; padding-right: 58px; font-family: Arial; font-weight: bold; font-size: 18; color: #32a852;">Correct - A</div>
          		<div style="padding-top: 14px; padding-left: 58px; font-family: Arial; font-weight: bold;">Student McClass</div>
          		<div style="float: left; padding-left: 58px; font-family: Arial; font-weight: bold; font-size: 12; color: #5A5A5A;">Student</div>
        	</div>  
      	</div>
	);
}

export default ParticipantPill;