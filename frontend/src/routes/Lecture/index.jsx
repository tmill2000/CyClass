import React, { useState, useEffect, createRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DataStore from "../../utilities/data/DataStore";

import PollFormPopup from "../../components/Poll/PollForm/PollFormPopup";
import ErrorPage from "../ErrorPage";

import LectureFeed from "./LectureFeed";
import NewMessageEntry from "./NewMessageEntry";
import LiveLectureTitle from "./LiveLectureTitle";
import LiveLectureLeftMenu from "./LiveLectureLeftMenu";

import LectureState from "./LectureState";

let lectureState = null;

function Lecture(props) {

	// Get lecture and course IDs from path params and validate them
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
	let isElevatedUser = false;
	for (const course of JSON.parse(DataStore.get("courses") || "[]")) {
		if (course.id == courseID) {
			isElevatedUser = course.role == "PROFESSOR" || course.role == "TA"
			break;
		}
	}

	// Get/generate lecture state
	if (lectureState == null || lectureState.lectureID != lectureID) {
		if (lectureState != null) {
			lectureState.stop();
		}
		lectureState = new LectureState(userID, courseID, lectureID);
	}

	// Create hooks
	const [stateVersion, setStateVersion] = useState(lectureState.version);
	const navigate = useNavigate();

	// Add effect for setting up API connection
	useEffect(() => {
		if (lectureState != null) {
			lectureState.start(setStateVersion, navigate);
			return () => {
				lectureState.stop();
				lectureState = null;
			};
		}
	}, [ lectureID ]);

	// Return component
	const api = lectureState.api
	return (
		<div>
            <LiveLectureTitle lecture_title="Example Title 14" lecture_starttime="14"></LiveLectureTitle>
			<div style={{ display: "flex" }}>
            	<LiveLectureLeftMenu userIDname={userID.name} userIDrole={userID.role} api={api} elevated={isElevatedUser}/>
				<div style={{ display: "flex", flexDirection: "column", width: "87%", height: "calc(100vh - 140px)" }}>
					<LectureFeed api={api} elevated={isElevatedUser} messages={lectureState.messages} polls={lectureState.polls} />
					<NewMessageEntry api={api} />
				</div>
			</div>
		</div>
	);

}

export default Lecture;