/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	02/14/2023
 */

import axios from "axios";

/**
 * Interface for the API related to live lectures.
 */
class LiveLectureAPI {

	/**
	 * Creates a new API interface for a live lecture of the specified lecture ID.
	 * @param {Number} userID
	 * @param {Number} courseID
	 * @param {Number} lectureID 
	 */
	constructor(userID, courseID, lectureID) {
		this.userID = userID;
		this.courseID = courseID;
		this.lectureID = lectureID;
		this.eventTarget = new EventTarget();
	}

	/**
	 * Returns if the given lecture parameters match this lecture.
	 * @param {Number} userID
	 * @param {Number} courseID
	 * @param {Number} lectureID 
	 * @returns if matching lecture
	 */
	isLecture(userID, courseID, lectureID) {

		// Return if all are same
		return this.userID === userID && this.courseID === courseID && this.lectureID === lectureID;

	}

	/**
	 * Returns if a live connection currently exists.
	 * @returns if live connection exists
	 */
	isLive() {

		// Return if connection exists
		return this.websocket != null;

	}

	/**
	 * Attempts to open a WebSocket connection to the server, later firing an open or close event depending on if
	 * successful. Will throw an error if a connection already exists.
	 */
	openLive() {

		// Verify no existing connection and lecture ID
		if (this.websocket != null) {
			throw new Error("WebSocket connection has already been established");
		} else if (this.lectureID == null) {
			throw new Error("No lecture was specified");
		}

		// Build URL
		const location = window.location;
		const protocol = location.protocol == "https:" ? "wss:" : "ws:";
		const port = location.port != '' ? `:${location.port}` : ""
		const searchParams = new URLSearchParams();
		searchParams.append("userId", this.userID);
		searchParams.append("courseId", this.courseID);
		searchParams.append("lectureId", this.lectureID);
		const url = `${protocol}//${location.hostname}${port}?${searchParams}`;

		// Open connection
		console.log("Connecting to WebSocket...");
		this.websocket = new WebSocket(url);

		// Set event handlers
		this.websocket.onopen = (event) => {
			console.log("WebSocket connection established");

			// Dispatch
			const lectureEvent = new LiveLectureOpenEvent(this.lectureID);
			this.eventTarget.dispatchEvent(lectureEvent);

		};
		this.websocket.onclose = (event) => {
			console.log("WebSocket connection closed");

			// Clear var
			this.websocket = null;

			// Dispatch
			const lectureEvent = new LiveLectureCloseEvent(this.lectureID, event);
			this.eventTarget.dispatchEvent(lectureEvent);

		}
		this.websocket.onerror = (event) => {

			// Log (close event should also be fired regardless)
			console.error("WebSocket errored:", event)

		}
		this.websocket.onmessage = (event) => {

			// Parse JSON
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch (err) {
				console.error("Invalid JSON from WebSocket:", err);
				console.error("JSON body:", event.data);
				return;
			}

			// Create and dispatch event depending on type of message
			let lectureEvent = null;
			switch (msg.type) {
			case "message":
				lectureEvent = new LiveLectureMessageEvent(this.lectureID, null, msg.payload.body, msg.payload.sender_id, msg.payload.is_anonymous, new Date(msg.payload.timestamp));
				break;
			}
			if (lectureEvent != null) {
				this.eventTarget.dispatchEvent(lectureEvent);
			} else {
				console.error("Unrecognized WebSocket event type:", msg.type);
			}

		}

	}

	/**
	 * Closes an existing WebSocket connection, if exists.
	 */
	closeLive() {

		// Close connection, if exists
		if (this.websocket != null) {
			this.websocket.close();
		}

	}

	/**
	 * Fetches the live lecture history. If a timestamp is specified, then only messages before that timestamp will be
	 * fetched (within a server-defined limit). Otherwise, it will fetch the most recent messages. Does not resolve to
	 * any value.
	 * @param {Number?} beforeTimestamp 
	 * @return Promise
	 */
	fetchHistory(beforeTimestamp) {

		// Perform get
		return axios.get("/api/message/messagesByLecture", {
				params: {
					lecture_id: this.lectureID,
					timestamp: beforeTimestamp || undefined
				}
			})
			.then((res) => {

				// Dispatch an event for each message
				for (const index in res.data) {
					const msg = res.data[index];
					const event = new LiveLectureMessageEvent(this.lectureID, msg.message_id, msg.body, msg.sender_id, msg.is_anonymous, new Date(msg.timestamp));
					this.eventTarget.dispatchEvent(event);
				}

			})
			.catch((err) => {
				console.error("Failed to fetch lecture history:", err);
				throw err;
			})

	}

	/**
	 * Sends a message to the live lecture from the currently logged-in user. Assumes a live lecture connection has been
	 * established.
	 * @param {String} body 
	 * @param {Boolean} anonymous 
	 */
	sendMessage(body, anonymous) {

		// Verify connection
		if (this.websocket == null) {
			throw new Error("No WebSocket connection was established");
		}

		// Send message
		this.websocket.send(JSON.stringify({
			type: "message",
			payload: {
				sender_id: this.userID,
				body: body,
				is_anonymous: anonymous,
				course_id: this.courseID,
				lecture_id: this.lectureID,
				parent_id: null
			}
		}));

	}

	/**
	 * Creates a new poll with the specified prompt that will be open for the specified number of minutes (or null if
	 * indefinite / manually closed) and has the specified choice options. Assumes a live lecture connection has been
	 * established.
	 * @param {string} prompt 
	 * @param {number?} openTime
	 * @param {{ text: string, correct: boolean }[]} choices
	 */
	createPoll(prompt, openTime, choices) {

		// Verify connection
		if (this.websocket == null) {
			throw new Error("No WebSocket connection was established");
		}

		// Map choices to backend format
		const choiceArray = [];
		for (const choice of choices) {
			choiceArray.push({
				choice_text: choice[0],
				is_correct_choice: choice[1]
			});
		};
		// Send message
		this.websocket.send(JSON.stringify({
			type: "poll",
			payload: {
				question_text: prompt,
				poll_choices: choiceArray
			}
		}));
	}

	/**
	 * Responds to the given poll, setting the specified choice as the logged-in user's response. Returns a Promise that
	 * will resolve if the operation was successful.
	 * @param {number} pollID 
	 * @param {number} choiceID 
	 * @return Promise
	 */
	respondToPoll(pollID, choiceID) {

		// Perform post
		return axios.post("/api/poll-response", {
				course_id: this.courseID,
				poll_id: pollID,
				choice_id: choiceID
			})
			.then((res) => {})
			.catch((err) => {
				console.error("Failed to respond to poll:", err);
				throw err;
			})

	}

	/**
	 * Returns the user's response (a `choiceID`) to the given poll. Returns a Promise that will resolve with the an
	 * object of the following format (unless an error occurs):
	 * - `choiceID?` (number or null if not responded yet)
	 * - `correct?` (boolean or null if not responded/available yet)
	 * @param {number} pollID 
	 * @return Promise
	 */
	getPollResponse(pollID) {

		// Perform get
		return axios.get("/api/poll/metrics", {
				params: {
					course_id: this.courseID,
					poll_id: this.pollID
				}
			})
			.then((res) => {

				// Find response in response list
				for (const i of res.data.userResponses) {
					if (i.user_id == this.userID) {
						return {
							choiceID: i.poll_choice_id,
							correct: i.is_correct_choice
						}
					}
				}

				// Didn't find, so return all null
				return {
					choiceID: null,
					correct: null
				}

			})
			.catch((err) => {
				console.error("Failed to get poll response:", err);
				throw err;
			})

	}

	/**
	 * Returns the poll participation statistics for the given poll. Note that this API method requires elevated account
	 * permissions (students will not be able to invoke this successfully). Returns a Promise that will fulfill to the
	 * following object:
	 * - `totalResponses` (number)
	 * - `correctResponses` (number)
	 * - `responses`: ```[
	 *       {
	 *           userID: number,
	 *           choiceID: number,
	 *           correct: boolean
	 *       },
	 *       ...
	 *   ]```
	 * @param {number} pollID 
	 * @return Promise
	 */
	getPollParticipation(pollID) {

		// Perform get
		return axios.get("/api/poll/metrics", {
				params: {
					course_id: this.courseID,
					poll_id: this.pollID
				}
			})
			.then((res) => {

				// Make base object
				const result = {
					totalResponses: res.data.totalRespondants,
					correctResponses: res.data.correctResponses,
					responses: [],
				};

				// Add all responses in converted format
				for (const i of res.data.userResponses) {
					result.responses.push({
						userID: i.user_id,
						choiceID: i.poll_choice_id,
						correct: i.is_correct_choice
					});
				}

				// Return complete result object
				return result;

			})
			.catch((err) => {
				console.error("Failed to get poll participation:", err);
				throw err;
			})

	}

	/**
	 * Binds the given callback to execute whenever a live connection is opened successfully. Callback is passed a
	 * {@link LiveLectureOpenEvent}.
	 * @param {Function} callback 
	 */
	onLiveOpen(callback) {
		this.eventTarget.addEventListener("open", callback);
	}

	/**
	 * Unbinds the callback previously bound using `onLiveOpen()`.
	 * @param {Function} callback 
	 */
	removeOnLiveOpen(callback) {
		this.eventTarget.removeEventListener("open", callback);
	}

	/**
	 * Binds the given callback to execute whenever the live connection is closed. Callback is passed a
	 * {@link LiveLectureCloseEvent}.
	 * @param {Function} callback 
	 */
	onLiveClose(callback) {
		this.eventTarget.addEventListener("close", callback);
	}

	/**
	 * Unbinds the callback previously bound using `onLiveClose()`.
	 * @param {Function} callback 
	 */
	removeOnLiveClose(callback) {
		this.eventTarget.removeEventListener("close", callback);
	}

	/**
	 * Binds the given callback to execute whenever a new message is received from a live connection or from a prior API
	 * call. Callback is passed a {@link LiveLectureMessageEvent}.
	 * @param {Function} callback 
	 */
	onMessage(callback) {
		this.eventTarget.addEventListener("message", callback);
	}

	/**
	 * Unbinds the callback previously bound using `onMessage()`.
	 * @param {Function} callback 
	 */
	removeOnMessage(callback) {
		this.eventTarget.removeEventListener("message", callback);
	}

}

/**
 * Represents the successful WebSocket connection to a live lecture. Contains the following properties:
 * - `lectureID` (number)
 */
class LiveLectureOpenEvent extends Event {

	constructor(lectureID) {
		super("open");
		this.lectureID = lectureID;
	}

}

/**
 * Represents the closing of a WebSocket connection to a live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `closeCode` (number)
 * - `closeReason` (string)
 * - `dueToError` (boolean)
 */
class LiveLectureCloseEvent extends Event {

	constructor(lectureID, closeEvent) {
		super("close");
		this.lectureID = lectureID;
		this.closeCode = closeEvent.code;
		this.closeReason = closeEvent.reason;
		this.dueToError = closeEvent.code != 1000;
	}

}

/**
 * Represents a new message to a live lecture. Contains the following properties:
 * - `lectureID`: (number)
 * - `messageID` (number)
 * - `body` (string)
 * - `userID` (number)
 * - `isAnonymous` (boolean)
 * - `time` ({@link Date})
 */
class LiveLectureMessageEvent extends Event {

	constructor(lectureID, messageID, body, userID, isAnonymous, time) {
		super("message");
		this.lectureID = lectureID;
		this.messageID = messageID;
		this.body = body;
		this.userID = userID;
		this.isAnonymous = isAnonymous;
		this.time = time;
	}

}

export {
	LiveLectureOpenEvent,
	LiveLectureCloseEvent,
	LiveLectureMessageEvent
};
export default LiveLectureAPI;