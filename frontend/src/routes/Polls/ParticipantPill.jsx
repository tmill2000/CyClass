/**
 * AUTHOR:	Brandon Burt
 * CREATED:	02/11/2023
 * UPDATED:	02/12/2023
 */
 import React from 'react';
 import "./styles.css";
 import DataStore from '../../utilities/data/DataStore';
 import LiveLectureAPI from '../../utilities/api/LiveLectureAPI';
 import UserAPI from '../../utilities/api/UserAPI';

 const pollResults = (props) => [
    {
        user: {
            id: number,
            name: string,
            role: string
        },
        option: string,
        correct: boolean
    },
]

 function ParticipantPill() {
	const pathParams = useParams();
    const lectureID = parseInt(pathParams.lectureID);
    if (isNaN(lectureID)) {
        return <ErrorPage code={400} text="Invalid lecture number" />;
    }
    const courseID = parseInt(pathParams.courseID);
    if (isNaN(courseID)) {
        return <ErrorPage code={400} text="Invalid course number" />;
    }

    // Get user ID and permission level, verifying logged-in
    const userID = DataStore.get("userID");
    if (userID == null) {
        return <Navigate to="/login" />;
    }
	// Component
	return (
		<div style={{paddingTop: '50px', paddingLeft: '30px'}}>
    	 	<div style={{borderStyle: 'groove', backgroundColor: '#ededed', width: '510px', height: '60px'}}>
          		<div style={{float: 'right', paddingTop: '20px', paddingRight: '58px', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '18', color: '#32a852'}}>Correct - A</div>
          		<div style={{paddingTop: '14px', paddingLeft: '58px', fontFamily: 'Arial', fontWeight: 'bold'}}>{props.profile_name}</div>
          		<div style={{float: 'left', paddingLeft: '58px', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '12', color: '#5A5A5A'}}>Student</div>
        	</div>  
      	</div>
	);
}

export default ParticipantPill;