/**
 * AUTHOR:	Brandon Burt, Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	04/21/2023
 */
import React, { useEffect, useState } from 'react';
import "./styles.css";
import ParticipantPill from './ParticipantPill';
import { Link, useParams } from "react-router-dom";

import ErrorPage from "../ErrorPage";

import LocalUser from '../../utilities/model/LocalUser';
import LiveLectureAPI from '../../utilities/api/LiveLectureAPI';
import UserAPI from '../../utilities/api/UserAPI';
import { CSVLink } from "react-csv";

//  /course/1/lecture/1/results?poll=5

const headers = [
{ label: "First Name", key: "firstName" },
{ label: "Last Name", key: "lastName" },
{ label: "Email", key: "email" },
{ label: "Role", key: "role" },
{ label: "Correct", key: "correct" }
];


const userAPI = new UserAPI();

function ParticipationForm (props) {
	
	const pathParams = useParams();
	const lectureID = parseInt(pathParams.lectureID);
	if (isNaN(lectureID)) {
		return <ErrorPage code={400} text="Invalid lecture number" />;
	}
	const courseID = parseInt(pathParams.courseID);
	if (isNaN(courseID)) {
		return <ErrorPage code={400} text="Invalid course number" />;
	}

	let pollID = new URLSearchParams(window.location.search).get("poll");
	if (pollID == null) {
	return <ErrorPage code={400} text="Missing poll ID" />;
	}
	pollID = parseInt(pollID);
	if (isNaN(pollID)) {
	return <ErrorPage code={400} text="Invalid poll ID" />;
	}

	// Get user ID and permission level, verifying logged-in
	const userID = LocalUser.current?.userID;
	if (userID == null) {
		return <Navigate to="/login" />;
	}

	// State hooks
	const [ results, setResults ] = useState(null);

	// Pull participation info
	useEffect(() => {
		const lectureAPI = new LiveLectureAPI(userID, courseID, lectureID);
		lectureAPI.getPollParticipation(pollID)
			.then((result) => {
				const responses = [];
				Promise.allSettled(result.responses.map((response) => {
					
					// Pull user data
					return userAPI.getUserData(response.userID, courseID)
						.then((userData) => {
							responses.push({
								user: {
									id: response.userID,
									name: userData.displayName,
									firstName: userData.firstName,
									lastName: userData.lastName,
									email: userData.email,
									role: userData.role
								},
								option: response.choiceID,
								correct: response.correct
							})
						})
						.catch((err) => {
							responses.push({
								user: {
									id: response.userID,
									name: "Unknown",
									firstName: "ERROR",
									lastName: "ERROR",
									email: "ERROR",
									role: "Unknown"
								},
								option: response.choiceID,
								correct: response.correct
							})
						});
				}))
					.then(() => {

						// Update data
						setResults({
							responses: responses,
							totalParticipants: result.totalResponses
						});

					});
			});
	}, []);

	let responsesMap = null
	if(results != null){
		responsesMap = results.responses.map((response) => ({
			firstName: response.user.firstName,
			lastName: response.user.lastName,
			email: response.user.email,
			role: response.user.role,
			correct: response.correct
		}))
	}

	// Component
	return (
		<div className="page white-container">
		<div style={{float:'left', width: '50%'}}>
		<div className="header" style={{fontWeight:'bold', fontSize:'27px', fontFamily:'Arial', paddingLeft:'15px', paddingTop:'9px',float:'left'}}>Poll Participation</div>
		<div style={{fontWeight: 'bold', fontFamily: 'Arial', color: 'gray', textAlign: 'left', paddingTop: '47px', paddingLeft: '15px'}}>{results != null ? `${results.totalParticipants} participants` : "loading..."}</div>
		</div>
	<Link to={-1}>
		<div style={{float: 'right', paddingTop: '7px', width: '35px'}}>
		<a href="#" className="close-button">
			<div className="in">
				<div className="close-button-block"></div>
				<div className="close-button-block"></div>
			</div>
			<div className="out">
				<div className="close-button-block"></div>
				<div className="close-button-block"></div>
			</div>
		</a>
		</div>
	</Link>
		<div style={{paddingTop: '82px'}}>
		<div style={{borderTop: '1px solid gray'}}></div>
		</div>
		<div className="poll-results-block" style={{textAlign: 'center'}}>
			{responsesMap != null ? <CSVLink data={responsesMap} headers={headers} filename="Poll_Results.csv" ><button className='button-csv-download'>Poll Results</button></CSVLink> : null}
		</div>
		<div style={{paddingLeft: '160px'}}>
		{results != null ? results.responses.map((response, index) => <ParticipantPill name={response.user.name} role={response.user.role} correct={response.correct} altStyle={index % 2 == 1}></ParticipantPill>) : null}
		</div>
	</div>
	);

}

export default ParticipationForm;