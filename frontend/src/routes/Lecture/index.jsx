import React, { useState, useEffect, createRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import LocalUser from "../../utilities/model/LocalUser";

import ErrorPage from "../ErrorPage";

import LectureFeed from "./LectureFeed";
import NewMessageEntry from "./NewMessageEntry";
import LiveLectureTitle from "./LiveLectureTitle";
import SidePanel from "./SidePanel";
import "./styles.css";

import LectureState from "./LectureState";
import QuestionFeed from "./QuestionFeed";

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
	const userID = LocalUser.current?.userID;
	if (userID == null) {
		return <Navigate to="/login" />;
	} else if (!LocalUser.current.isInCourse(courseID)) {
		return <ErrorPage code={403} text="You are not a member of that course" />;
	}
	const user_role = LocalUser.current.getCourseRole(courseID);
	const isElevatedUser = user_role == "Professor" || user_role == "TA";

	// Get/generate lecture state
	if (lectureState == null || lectureState.lectureID != lectureID) {
		if (lectureState != null) {
			lectureState.stop();
		}
		lectureState = new LectureState(userID, courseID, lectureID);
	}

	// Create hooks
	const [_, setStateVersion] = useState(lectureState.version);
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
	const api = lectureState.api;
	return (
		<div className="lecture page">
            <LiveLectureTitle lectureID={lectureID} courseID={courseID} />
			<div className="lecture-main">
            	<SidePanel api={api} elevated={isElevatedUser} courseID={courseID} lectureID={lectureID}/>
				<div className="feed-container">
					<LectureFeed api={api} elevated={isElevatedUser} messages={lectureState.messages} polls={lectureState.polls} />
					<NewMessageEntry api={api} />
					<QuestionFeed api={api} questions={lectureState.questions} />
				</div>
			</div>
		</div>
	);

}

export default Lecture;