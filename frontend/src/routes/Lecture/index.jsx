import React, { useState, useEffect, createRef } from "react";

import DataStore from "../../utilities/data/DataStore";
import LiveLectureAPI from "../../utilities/api/LiveLectureAPI";
import UserAPI from "../../utilities/api/UserAPI";

import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/CheckboxWithLabel";
import DateTimeStamp from "../../components/DateTime/DateTimeStamp";
import LectureFeed from "../Lecture/LectureFeed";
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

		// Start by clearing previous state (API clean-up is mostly a sanity check)
		if (lectureAPI != null) {
			lectureAPI.closeLive();
			lectureAPI = null;
		}

		// Stop here if invalid lecture
		if (lectureID == null) {
			return;
		}

		// Create API instance and bind to events
		const meUserID = DataStore.get("userID");
		lectureAPI = new LiveLectureAPI(lectureID);
		lectureAPI.onLiveClose((event) => {

			// Check if unexpected
			if (event.dueToError) {

				// TODO:  display some sort of error

			}

		});
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

            <LiveLectureLeftMenu></LiveLectureLeftMenu>

			<LectureFeed messages={lectureData.messages} style={{position: "absolute", inset: "140px 0px 160px 220px"}} />
			
		</div>
	);

}

export default Lecture;