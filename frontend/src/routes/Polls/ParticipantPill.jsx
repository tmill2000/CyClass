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
		<div style={{paddingTop: '50px', paddingLeft: '30px'}}>
    	 	<div style={{borderStyle: 'groove', backgroundColor: '#ededed', width: '510px', height: '60px'}}>
          		<div style={{float: 'right', paddingTop: '20px', paddingRight: '58px', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '18', color: '#32a852'}}>Correct - A</div>
          		<div style={{paddingTop: '14px', paddingLeft: '58px', fontFamily: 'Arial', fontWeight: 'bold'}}>Student McClass</div>
          		<div style={{float: 'left', paddingLeft: '58px', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '12', color: '#5A5A5A'}}>Student</div>
        	</div>  
      	</div>
	);
}

export default ParticipantPill;