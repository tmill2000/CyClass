import React, { useState, useEffect, createRef } from "react";
import { Navigate, useParams } from "react-router-dom";

import DataStore from "../../utilities/data/DataStore";
import LiveLectureAPI from "../../utilities/api/LiveLectureAPI";
import UserAPI from "../../utilities/api/UserAPI";

import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/CheckboxWithLabel";
import DateTimeStamp from "../../components/DateTime/DateTimeStamp";
import LectureFeed from "./LectureFeed";
import NewMessageEntry from "./NewMessageEntry";
import LiveLectureTitle from "./LiveLectureTitle";
import LiveLectureLeftMenu from "./LiveLectureLeftMenu";
import ErrorPage from "../ErrorPage";
import PollFormPopup from "../../components/Poll/PollForm/PollFormPopup";

const userAPI = new UserAPI();
let lectureAPI = null;

const lectureDataMap = {};

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

	// Make new API instance, clearing previous state if API still exists for a different lecture (for some reason)
	if (lectureAPI != null && !lectureAPI.isLecture(userID, courseID, lectureID)) {
		lectureAPI.closeLive();
		lectureAPI = null;
	}
	if (lectureAPI == null) {
		lectureAPI = new LiveLectureAPI(userID, courseID, lectureID);
	}

	// Define lecture data and data version state
	let lectureData = lectureID != null ? lectureDataMap[lectureID] : null;
	if (lectureData == null) {
		lectureData = {
			messages: [],
			version: 0
		};
		if (lectureID != null) {
			lectureDataMap[lectureID] = lectureData;
		}
	}
	const [dataVersion, setDataVersion] = useState(lectureData.version);

	// Add effect for setting up API connection
	useEffect(() => {

		// Stop here if invalid lecture
		if (lectureID == null) {
			return;
		}

		// If not live, then bind to events and go live
		if (!lectureAPI.isLive()) {

			// Bind to events
			lectureAPI.onLiveClose((event) => {

				// Check if unexpected
				if (event.dueToError) {

					// TODO:  display some sort of error

				}

			});
			const meUserID = DataStore.get("userID");
			lectureAPI.onMessage(async (event) => {

				// Fetch user data (unless null)
				const userData = event.userID != null ? await userAPI.getUserData(event.userID) : {	
					name: "?",
					role: "?"
				};

				// Add to messages array
				lectureData.messages.push({
					user: {
						id: event.userID,
						name: userData.name,
						role: userData.role
					},
					me: event.userID == meUserID,
					text: event.body,
					time: event.time
				});

				// Update version
				setDataVersion(lectureData.version++);

			});

			// Begin accepting messages
			lectureAPI.fetchHistory();
			lectureAPI.openLive();

		}

		// Clean up upon page leave / new lecture
		return () => {
			lectureAPI.closeLive();
			lectureAPI = null;
			delete lectureDataMap[lectureID];
		};

	}, [ lectureID ]);
	
	return (
		<div>
            <LiveLectureTitle lecture_title="Example Title 14" lecture_starttime="14"></LiveLectureTitle>

			<div style={{ display: "flex" }}>
            	<LiveLectureLeftMenu userIDname={userID.name} userIDrole={userID.role} api={lectureAPI}/>
				<div style={{ display: "flex", flexDirection: "column", width: "87%", height: "calc(100vh - 140px)" }}>
					<LectureFeed api={lectureAPI} messages={lectureData.messages} />
					<NewMessageEntry api={lectureAPI} />
				</div>
			</div>
			
		</div>
	);

}

export default Lecture;