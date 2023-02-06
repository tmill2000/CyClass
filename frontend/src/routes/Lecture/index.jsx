import React, { useState, useEffect, createRef } from "react";

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

const userAPI = new UserAPI();
let lectureAPI = null;

const lectureDataMap = {};

function Lecture(props) {

	// Get lecture from URL and validate it
	const searchParams = new URLSearchParams(window.location.search);
	let lectureID = searchParams.get("id");
	if (lectureID != null) {
		lectureID = parseInt(lectureID);
		if (lectureID == NaN) {
			lectureID = null;
		}
	}
	if (lectureID == null) {

		// Log
		console.error("Lecture ID not specified in URL or is not a number");

		// TODO:  display some sort of error

	}

	// Make new API instance, clearing previous state if API still exists for a different lecture (for some reason)
	if (lectureAPI != null && lectureAPI.getLectureID() != lectureID) {
		lectureAPI.closeLive();
		lectureAPI = null;
	}
	if (lectureAPI == null && lectureID != null) {
		lectureAPI = new LiveLectureAPI(lectureID, DataStore.get("userID"));
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
					time: event.timestamp
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
            	<LiveLectureLeftMenu />
				<div style={{ display: "flex", flexDirection: "column", width: "87%", height: "calc(100vh - 140px)" }}>
					<LectureFeed messages={lectureData.messages} />
					<NewMessageEntry api={lectureAPI} />
				</div>
			</div>
			
		</div>
	);

}

export default Lecture;