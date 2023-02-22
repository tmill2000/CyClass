/**
 * AUTHOR:	Brandon Burt
 * CREATED:	02/11/2023
 * UPDATED:	02/12/2023
 */
 import React from 'react';
 import "./styles.css";

 function ParticipantPill(props) {

	// Component
	return (
		<div style={{paddingLeft: '30px'}}>
    	 	<div style={{backgroundColor: props.altStyle ? '#ededed' : '#FFF', width: '510px', height: '60px'}}>
          		<div style={{float: 'right', paddingTop: '20px', paddingRight: '58px', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '18', color: props.correct ? '#060' : '#600'}}>{props.correct ? "Correct" : "Incorrect"}</div>
          		<div style={{paddingTop: '14px', paddingLeft: '58px', fontFamily: 'Arial', fontWeight: 'bold'}}>{props.name}</div>
          		<div style={{float: 'left', paddingLeft: '58px', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '12', color: '#5A5A5A'}}>{props.role}</div>
        	</div>  
      	</div>
	);
}

export default ParticipantPill;