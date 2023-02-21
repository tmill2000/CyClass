/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/21/2023
 * UPDATED:	02/21/2023
 */

import LiveLectureAPI from "../../utilities/api/LiveLectureAPI";
import UserAPI from "../../utilities/api/UserAPI";

const TRY_RECONNECT_DELAY = 3; // (sec)

const userAPI = new UserAPI();

async function toUserInfo(userID, anonymous) {

	// If anonymous, return constant data; otherwise, fetch
	if (anonymous) {
		return {
			id: userID,
			name: "Anonymous",
			role: "Student"
		}
	} else if (userID != null) {
		const data = await userAPI.getUserData(userID);
		return {
			id: userID,
			name: data.name,
			role: data.role
		}
	}
	return {
		name: "???",
		role: "Unknown"
	};

}

export default class LectureState {

	messages = []
	polls = []
	version = 0

	constructor(userID, courseID, lectureID) {

		// Make API for this lecture and store IDs
		this.api = new LiveLectureAPI(userID, courseID, lectureID);
		this.userID = userID
		this.courseID = courseID
		this.lectureID = lectureID

		// Bind to new messages
		this.api.onMessage(async (event) => {

			// Add to messages array
			this.messages.push({
				id: event.messageID,
				user: await toUserInfo(event.userID, event.isAnonymous),
				me: event.userID == this.userID,
				text: event.body,
				time: event.time
			});

			// Update version
			this.setStateVersion(++this.version);

		});
		this.api.onPoll(async (event) => {

			// Add to polls array
			this.polls.push({
				id: event.pollID,
				user: await toUserInfo(event.userID, false),
				me: event.userID == this.userID,
				prompt: event.prompt,
				choices: event.choices,
				closed: event.closed,
				time: event.time
			});

			// Update version
			this.setStateVersion(++this.version);

		});

		// On close-due-to-errors, auto-restart
		this.api.onLiveClose((event) => {

			// If unexpected, try to reconnect after a short delay
			if (event.dueToError) {
				console.log(`Detected connection failure (${event.closeCode}). Will attempt to reconnect in ${TRY_RECONNECT_DELAY} seconds...`);
				setTimeout(() => {
					this.stop();
					this.start(this.setStateVersion);
				}, TRY_RECONNECT_DELAY * 1000);
			}

		});

	}

	start(setStateVersionHook) {

		// Store hook
		this.setStateVersion = setStateVersionHook

		// Begin accepting messages if not live
		if (!this.api.isLive()) {
			this.api.fetchHistory();
			this.api.openLive();
		}

	}

	stop() {

		// Close live
		this.api.closeLive();

		// Clear data
		this.messages = [];
		this.polls = [];

	}

};