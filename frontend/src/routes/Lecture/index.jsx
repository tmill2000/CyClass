import React, { useState, useEffect, createRef } from "react";
import { Navigate, useParams } from "react-router-dom";

import DataStore from "../../utilities/data/DataStore";

import ErrorPage from "../ErrorPage";

import LectureFeed from "./LectureFeed";
import NewMessageEntry from "./NewMessageEntry";
import LiveLectureTitle from "./LiveLectureTitle";
import LiveLectureLeftMenu from "./LiveLectureLeftMenu";
import ErrorPage from "../ErrorPage";
import PollFormPopup from "../../components/Poll/PollForm/PollFormPopup";

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

	// Get user ID, verifying logged-in
	const userID = DataStore.get("userID");
	if (userID == null) {
		return <Navigate to="/login" />;
	}

	// Get/generate lecture state
	if (lectureState == null || lectureState.lectureID != lectureID) {
		if (lectureState != null) {
			lectureState.stop();
		}
		lectureState = new LectureState(userID, courseID, lectureID);
	}

	// Create version hook
	const [stateVersion, setStateVersion] = useState(lectureState.version);

	// Add effect for setting up API connection
	useEffect(() => {
		if (lectureState != null) {
			lectureState.start(setStateVersion);
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
            	<LiveLectureLeftMenu userIDname={userID.name} userIDrole={userID.role} api={lectureAPI}/>
				<div style={{ display: "flex", flexDirection: "column", width: "87%", height: "calc(100vh - 140px)" }}>
					<LectureFeed api={api} messages={lectureState.messages} polls={lectureState.polls} />
					<NewMessageEntry api={api} />
				</div>
			</div>
		</div>
	);

}

export default Lecture;