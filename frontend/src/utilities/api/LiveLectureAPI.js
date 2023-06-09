/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	04/05/2023
 */

import axios from "axios";

import DataStore from "../data/DataStore";

const ATTACHMENT_TYPES = {
	"image/png": {
		extension: ".png"
	},
	"image/jpeg": {
		extension: ".jpeg"
	},
	"application/pdf": {
		extension: ".pdf"
	},
	"text/plain": {
		extension: ".txt"
	},
	"video/mp4": {
		extension: ".mp4"
	}
}

/**
 * Interface for the API related to live lectures.
 */
class LiveLectureAPI {

	eventTarget = new EventTarget()

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
		const websocket = new WebSocket(url);
		this.websocket = websocket;

		// Set event handlers
		let closeWasError = false;
		websocket.onopen = (event) => {
			console.log("WebSocket connection established");

			// If already cleared from object, auto-close
			if (this.websocket != websocket) {
				websocket.close();
				return;
			}

			// Dispatch
			const lectureEvent = new LiveLectureOpenEvent(this.lectureID);
			this.eventTarget.dispatchEvent(lectureEvent);

		};
		websocket.onclose = (event) => {
			console.log(`WebSocket connection closed (${event.code})`);

			// Clear var
			this.websocket = null;

			// Dispatch
			const lectureEvent = new LiveLectureCloseEvent(this.lectureID, event, closeWasError);
			this.eventTarget.dispatchEvent(lectureEvent);

		}
		websocket.onerror = (event) => {

			// Record and log (close event should also be fired afterward regardless)
			closeWasError = true
			console.error("WebSocket errored:", event)

		}
		websocket.onmessage = (event) => {

			// Parse JSON
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch (err) {
				console.error("Invalid JSON from WebSocket:", err);
				console.error("Invalid JSON body:", event.data);
				return;
			}
			console.log("New WebSocket message:", msg.type);

			// Create and dispatch event depending on type of message
			let lectureEvent = null;
			switch (msg.type) {
			case "message":
			case "media_upload":

				// Make message event
				lectureEvent = new LiveLectureMessageEvent(this.lectureID, msg.payload.message_id, {
					body: msg.payload.body,
					userID: msg.payload.sender_id,
					isAnonymous: msg.payload.is_anonymous,
					time: new Date(msg.payload.timestamp),
					attachments: msg.payload.media_id != null ? [{
						id: msg.payload.media_id,
						type: msg.payload.file_type,
						name: msg.payload.file_name
					}] : null
				});
				break;

			case "message_update":

				// Make update/deleted event
				if (msg.payload.deleted) {
					lectureEvent = new LiveLectureMessageDeletedEvent(this.lectureID, msg.payload.message_id);
				} else {
					lectureEvent = new LiveLectureMessageUpdatedEvent(this.lectureID, msg.payload.message_id, {
						body: msg.payload.body,
						time: new Date()
					});
				}
				break;

			case "poll":

				// Map choices to frontend format, checking for issues
				let valid = true;
				const choices = msg.payload.poll_choices.map((choice, index) => {
					const id = msg.payload.pollInfo.pollChoiceIds[index];
					if (id == null) {
						console.error(`Received invalid poll from WebSocket: missing respective choice ID for choice with text "${choice.choice_text}"`);
						valid = false;
						return {};
					}
					return {
						id: id,
						text: choice.choice_text
					};
				});
				if (!valid) {
					return;
				}

				// Make poll event
				lectureEvent = new LiveLecturePollEvent(this.lectureID, msg.payload.pollInfo.pollId, {
					prompt: msg.payload.question_text,
					closeDate: msg.payload.close_date != null ? new Date(msg.payload.close_date) : null,
					time: new Date(msg.payload.timestamp),
					choices: choices,
					hasMultipleAnswers: msg.payload.poll_type == "MULTIPLE_SELECT"
				});
				break;

			case "poll_update":

				// Make update event
				lectureEvent = new LiveLecturePollUpdatedEvent(this.lectureID, msg.payload.poll_id, {
					prompt: msg.payload.prompt,
					choices: msg.payload.choices,
					time: new Date()
				});
				break;

			case "poll_close":

				// Make poll updated event
				lectureEvent = new LiveLecturePollUpdatedEvent(this.lectureID, msg.payload.poll_id, {
					closeDate: new Date(Date.now() - 60 * 1000),
					time: new Date()
				});
				break;

			case "question":

				// Retrieve questions list (frontend manages storage of questions)
				const storeKey = `questionsLecture${this.lectureID}`;
				if (this.questions == null) {
					this.questions = DataStore.get(storeKey) ?? [];
				}
				if (this.nextQuestionID == null) {
					this.nextQuestionID = this.questions.reduce((accum, curr) => Math.max(accum, curr.id), 0) + 1;
				}

				// Add question to list and record
				const question = {
					id: this.nextQuestionID++,
					question: msg.payload.body,
					userID: msg.payload.userId,
					anonymous: msg.payload.is_anonymous,
					time: new Date().toJSON()
				};
				this.questions = [...this.questions, question];
				DataStore.set(storeKey, this.questions);

				// Make question event
				lectureEvent = new LiveLectureQuestionEvent(this.lectureID, question.id, {
					question: question.question,
					userID: question.userID,
					isAnonymous: question.anonymous,
					time: new Date(question.time)
				});
				break;

			default:

				// Make error event if message was given
				if (msg.msg != null) {
					lectureEvent = new LiveLectureErrorEvent(this.lectureID, msg.msg, new Date());
				}

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

		// Check for a connection
		if (this.websocket != null) {

			// Extract and clear
			const websocket = this.websocket
			this.websocket = null

			// Close if OPEN (if CONNECTING, will auto-close since .websocket was cleared; see "onopen" handler)
			if (websocket.readyState == WebSocket.OPEN) {
				websocket.close();
			}
		}

	}

	/**
	 * Fetches the live lecture history. If a timestamp is specified, then only messages before that timestamp will be
	 * fetched (within a server-defined limit). Otherwise, it will fetch the most recent messages. Does not resolve to
	 * any value, but will instead dispatch events for each fetched message as if it had streamed in live.
	 * @param {Date?} beforeTimestamp 
	 * @return Promise
	 */
	fetchHistory(beforeTimestamp) {

		// Get questions from local storage and fire events for each
		if (this.questions == null) {
			this.questions = DataStore.get(`questionsLecture${this.lectureID}`) ?? [];
		}
		for (const question of this.questions) {
			const event = new LiveLectureQuestionEvent(this.lectureID, question.id, {
				question: question.question,
				userID: question.userID,
				isAnonymous: question.anonymous,
				time: new Date(question.time)
			});
			this.eventTarget.dispatchEvent(event);
		}

		// Perform get
		return axios.get("/api/message/messagesByLecture", {
				params: {
					lecture_id: this.lectureID,
					timestamp: beforeTimestamp?.toJSON()
				}
			})
			.then((res) => {

				// Go through each "message"
				for (const msg of res.data) {

					// Use id field to infer type of message
					if (msg.message_id != null) {

						// Dispatch message
						const event = new LiveLectureMessageEvent(this.lectureID, msg.message_id, {
							body: msg.body,
							userID: msg.sender_id,
							isAnonymous: msg.is_anonymous,
							time: new Date(msg.timestamp),
							attachments: msg.media_id != null ? [{
								id: msg.media_id,
								type: msg.file_type,
								name: msg.file_name
							}] : null
						});
						this.eventTarget.dispatchEvent(event);

					} else if (msg.poll_id != null) {

						// Transform choices into frontend format
						const choices = msg.choices.map((choice) => ({
							id: choice.poll_choice_id,
							text: choice.text,
							correct: choice.is_correct_choice
						}));

						// Dispatch poll
						const event = new LiveLecturePollEvent(this.lectureID, msg.poll_id, {
							prompt: msg.question,
							closeDate: msg.close_date != null ? new Date(msg.close_date) : null,
							time: new Date(msg.timestamp),
							choices: choices,
							hasMultipleAnswers: msg.poll_type == "MULTIPLE_SELECT"
						});
						this.eventTarget.dispatchEvent(event);

					}

				}

			})
			.catch((err) => {
				console.error("Failed to fetch lecture history:", err);
				throw err;
			});

	}

	/**
	 * Returns if the provided attachment is able to be uploaded and is acceptable, as well as a string reason if not
	 * acceptable.
	 * @param {File} attachment 
	 * @returns {[boolean, string?]}
	 */
	isAttachmentAcceptable(attachment) {

		// Valid type
		if (ATTACHMENT_TYPES[attachment.type] == null) {
			return [false, "Unsupported file type"]
		}

		// Passed, so return success
		return [true, null]

	}

	/**
	 * Sends a message to the live lecture from the currently logged-in user. Assumes a live lecture connection has been
	 * established.
	 * @param {String} body 
	 * @param {Boolean} anonymous 
	 * @param {File?} attachment 
	 */
	sendMessage(body, anonymous, attachment) {

		// Verify connection
		if (this.websocket == null) {
			throw new Error("No WebSocket connection was established");
		}

		// Check if including an attachment (requires special procedure)
		if (attachment != null) {

			// Read in file
			const reader = new FileReader();
			reader.onload = (e) => {

				// POST using API
				axios.post("/api/message", {
					body: body,
					is_anonymous: anonymous,
					course_id: this.courseID,
					lecture_id: this.lectureID,
					parent_id: null,
					has_media: true
				})
					.then((res) => {
	
						// Then use media ID and loaded file to upload
						axios.post("/api/upload-media", reader.result, {
							params: {
								media_id: res.data.mediaId,
								course_id: this.courseID,
								file_name: attachment.name
							},
							headers: {
								"Content-Type": attachment.type
							}
						})
							.catch((err) => {
								console.error("Failed to upload attachment:", err);
							})
							.finally(() => {

								// Stream to websocket (even if upload fails) if still connected
								if (this.websocket != null) {
									this.websocket.send(JSON.stringify({
										type: "media_upload",
										payload: {
											sender_id: this.userID,
											body: body,
											is_anonymous: anonymous,
											course_id: this.courseID,
											lecture_id: this.lectureID,
											parent_id: null,
											message_id: res.data.messageId,
											media_id: res.data.mediaId,
											file_type: attachment.type,
											file_name: attachment.name
										}
									}));
								}

							});
	
					})
					.catch((err) => {
						console.error("Failed to send message:", err);
						throw err;
					});

			};
			reader.onerror = (e) => {
				console.error("Failed to read file: " + attachment.name);
			};
			reader.readAsArrayBuffer(attachment);

		} else {

			// Send message through WebSocket (backend will record)
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

	}
	/**
	 * Edits a message when selected, and sends the updatedMessage through web socket.
	 * @param {*} messageId 
	 * @param {*} updatedContent 
	 */
	editMessage(messageId, updatedContent) {

		// Perform patch
		return axios.patch("/api/message", {
			message_id: messageId,
			body: updatedContent,
		})
			.then((res) => {

				// Send edited message through WebSocket
				if (this.websocket != null) {
					this.websocket.send(JSON.stringify({
						type: "message_update",
						payload: {
							message_id: messageId,
							body: updatedContent
						}
					}));
				}

			})
			.catch((err) => {
				console.error("Failed to edit message", err);
				throw err;
			});

	};

	/**
	 * Deletes a message when selected and sends through web socket. 
	 * @param {*} messageId
	 */
	deleteMessage (messageId) {

		// Perform deletion
		return axios.delete("/api/message", {
			params: { 
				message_id: messageId, 
				course_id: this.courseID 
			},
		})
			.then((res) => {

				// Also send through websocket
				if (this.websocket != null) {
					this.websocket.send(JSON.stringify({
						type: "message_update",
						payload: {
							message_id: messageId,
							deleted: true
						}
					}));
				}

			})
			.catch((err) => {
				console.error("Failed to delete message", err);
				throw err;
			});

	};

	/**
	 * Sends a request to retrieve the file attached to a message. Returns a Promise that will resolve to the loaded
	 * File if successful.
	 * @param {string} attachmentID 
	 * @param {string?} fileName optional name to assign to file
	 * @returns {Promise<File>}
	 */
	getAttachment(attachmentID, fileName) {

		// Make request
		return axios.get("/api/download-media", {
			params: {
				course_id: this.courseID,
				media_id: attachmentID
			},
			responseType: "arraybuffer"
		})
			.then((res) => {

				// Map MIME type to extension
				const mimeType = res.headers["content-type"];
				const extension = ATTACHMENT_TYPES[mimeType]?.extension ?? "";
				if (extension == "") {
					console.error("Unknown attachment type:", mimeType);
				}

				// Make into File and return
				return new File([res.data], fileName ?? ("attachment" + extension), {
					type: mimeType
				});

			})
			.catch((err) => {
				console.error("Failed to download attachment:", err);
				throw err;
			});

	}

	/**
	 * Refreshs info about the poll with the given ID.
	 * @param {number} pollID 
	 */
	refreshPoll(pollID) {

		// Send GET
		return axios.get("/api/poll", {
			params: {
				poll_id: pollID,
				course_id: this.courseID
			}
		})
			.then((res) => {

				// Send out event
				this.eventTarget.dispatchEvent(new LiveLecturePollUpdatedEvent(this.lectureID, pollID, {
					prompt: res.data.question_text,
					closeDate: new Date(res.data.close_date),
					time: new Date(res.data.timestamp),
					choices: res.data.poll_choices.map((choice) => ({
						id: choice.poll_choice_id,
						text: choice.choice_text,
						correct: choice.is_correct_choice
					})),
					hasMultipleAnswers: res.data.poll_type == "MULTIPLE_SELECT"
				}));

			})
			.catch((err) => {
				console.error("Failed to get poll:", err);
				throw err;
			});

	}

	/**
	 * Creates a new poll with the specified prompt that will be open for the specified number of minutes (or null if
	 * indefinite / manually closed) and has the specified choice options. Assumes a live lecture connection has been
	 * established.
	 * @param {string} prompt 
	 * @param {Date?} close_time
	 * @param {number} course_id
	 * @param {number} lecture_id
	 * @param {{ text: string, correct: boolean }[]} choices
	 */
	createPoll(prompt, close_time, choices, course_id, lecture_id, poll_type) {
		
		// Verify connection
		if (this.websocket == null) {
			throw new Error("No WebSocket connection was established");
		}

		// Send message with mapped values
		this.websocket.send(JSON.stringify({
			type: "poll",
			payload: {
				lecture_id: lecture_id,
				question_text: prompt,
				
				poll_choices: choices.map(choice => ({
					choice_text: choice.text,
					is_correct_choice: choice.correct
				})),
				course_id: course_id,
				close_date: close_time,
				poll_type: poll_type
			}
		}));
	}

	/**
	 * Closes the given poll. Returns a Promise that will resolve if the operation was successful.
	 * @param {number} pollID
	 * @return Promise
	 */
	closePoll(pollID) {

		// Verify connection
		if (this.websocket == null) {
			throw new Error("No WebSocket connection was established");
		}

		// Perform patch
		return axios.patch("/api/poll/close", {}, {
				params: {
					course_id: this.courseID,
					poll_id: pollID
				}
			})
			.then((res) => {

				// Also send through websocket
				if (this.websocket != null) {
					this.websocket.send(JSON.stringify({
						type: "poll_close",
						payload: {
							poll_id: pollID
						}
					}));
				}

			})
			.catch((err) => {
				console.error("Failed to close poll:", err);
				throw err;
			});

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
	 * Returns the user's responses (a `choiceID`) to the given poll. Returns a Promise that will resolve with the an
	 * object of the following format (unless an error occurs):
	 * - `choiceID?` (number or null if not responded yet)
	 * - `correct?` (boolean or null if not responded/available yet)
	 * @param {number} pollID 
	 * @return Promise
	 */
	getPollResponses(pollID) {

		// Perform get
		return axios.get("/api/poll/metrics", {
				params: {
					course_id: this.courseID,
					poll_id: pollID
				}
			})
			.then((res) => {

				// Try to collect responses in response list
				const responses = [];
				for (const i of res.data.userResponses) {
					if (i.user_id == this.userID) {
						responses.push({
							choiceID: i.poll_choice_id,
							correct: i.is_correct_choice
						});
					}
				}

				// Return what was found
				return responses

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
					poll_id: pollID
				}
			})
			.then((res) => {

				// Transform into frontend format and return
				return {
					totalResponses: res.data.totalRespondants,
					correctResponses: res.data.correctResponses,
					responses: res.data.userResponses.map((i) => ({
						userID: i.user_id,
						choiceID: i.poll_choice_id,
						correct: i.is_correct_choice
					}))
				};

			})
			.catch((err) => {
				console.error("Failed to get poll participation:", err);
				throw err;
			})

	}

	/**
	 * Edits a polls prompt
	 * @param {*} pollId 
	 * @param {*} updatedPrompt 
	 */
	editPollPrompt(pollId, updatedPrompt) {

		// Perform patch
		return axios.patch("/api/poll", {
			poll_id: pollId,
			question_text: updatedPrompt
		})
			.then((res) => {
				
				// Update through websocket if connection is still live
				if (this.websocket != null) {
					this.websocket.send(JSON.stringify({
						type: "poll_update",
						payload: {
							poll_id: pollId,
							prompt: updatedPrompt
						}
					}));
				}

			})
			.catch((err) => {
				console.error("Failed to edit prompt", err);
				throw err;
			});

	};

	/**
	 * Edits a polls choice text
	 * @param {*} pollChoiceId 
	 * @param {*} updatedChoice 
	 */
	editPollChoiceText(pollID, pollChoiceId, updatedChoice) {

		// Perform patch
		return axios.patch('/api/poll-choice', {
			poll_choice_id: pollChoiceId,
			choice_text: updatedChoice
		})
			.then((res) => {
				
				// Update through websocket if connection is still live
				if (this.websocket != null) {
					this.websocket.send(JSON.stringify({
						type: "poll_update",
						payload: {
							poll_id: pollID,
							choices: [{
								id: pollChoiceId,
								text: updatedChoice
							}]
						}
					}));
				}

			})
			.catch((err) => {
				console.error("Failed to edit choice",err);
				throw err;
			});

	};
	
	/**
	 * Sends the given question to the course owner (i.e. not in chat). Can optionally be anonymous.
	 * @param {string} question 
	 * @param {boolean?} anonymous
	 */
	sendQuestion(question, anonymous) {

		// Send question through WebSocket
		this.websocket.send(JSON.stringify({
			type: "question",
			payload: {
				body: question,
				is_anonymous: anonymous ?? false
			}
		}));

	}

	/**
	 * Deletes the specified question, making it such that it will never show up on future history fetches.
	 * @param {number} questionID 
	 */
	deleteQuestion(questionID) {

		// Lazy-load questions
		const storeKey = `questionsLecture${this.lectureID}`;
		if (this.questions == null) {
			this.questions = DataStore.get(storeKey) ?? [];
		}

		// Find, remove, and save
		const index = this.questions.findIndex(e => e.id == questionID);
		if (index >= 0) {
			this.questions = [...this.questions];
			this.questions[index] = this.questions[this.questions.length - 1];
			this.questions.pop();
			if (this.questions.length == 0) {
				DataStore.clear(storeKey);
			} else {
				DataStore.set(storeKey, this.questions);
			}
		}

		// Fire event
		this.eventTarget.dispatchEvent(new LiveLectureQuestionDeletedEvent(this.lectureID, questionID));

	}

	onLiveOpen(callback) {
		this.eventTarget.addEventListener("open", callback);
	}
	removeOnLiveOpen(callback) {
		this.eventTarget.removeEventListener("open", callback);
	}

	onLiveClose(callback) {
		this.eventTarget.addEventListener("close", callback);
	}
	removeOnLiveClose(callback) {
		this.eventTarget.removeEventListener("close", callback);
	}

	onMessage(callback) {
		this.eventTarget.addEventListener("message", callback);
	}
	removeOnMessage(callback) {
		this.eventTarget.removeEventListener("message", callback);
	}

	onMessageUpdated(callback) {
		this.eventTarget.addEventListener("messageUpdated", callback);
	}
	removeOnMessageUpdated(callback) {
		this.eventTarget.removeEventListener("messageUpdated", callback);
	}

	onMessageDeleted(callback) {
		this.eventTarget.addEventListener("messageDeleted", callback);
	}
	removeOnMessageDeleted(callback) {
		this.eventTarget.removeEventListener("messageDeleted", callback);
	}

	onPoll(callback) {
		this.eventTarget.addEventListener("poll", callback);
	}
	removeOnPoll(callback) {
		this.eventTarget.removeEventListener("poll", callback);
	}

	onPollUpdated(callback) {
		this.eventTarget.addEventListener("pollUpdated", callback);
	}
	removeOnPollUpdated(callback) {
		this.eventTarget.removeEventListener("pollUpdated", callback);
	}

	onQuestion(callback) {
		this.eventTarget.addEventListener("question", callback);
	}
	removeOnQuestion(callback) {
		this.eventTarget.removeEventListener("question", callback);
	}

	onQuestionDeleted(callback) {
		this.eventTarget.addEventListener("questionDeleted", callback);
	}
	removeOnQuestionDeleted(callback) {
		this.eventTarget.removeEventListener("questionDeleted", callback);
	}

	onError(callback) {
		this.eventTarget.addEventListener("error", callback);
	}
	removeOnError(callback) {
		this.eventTarget.removeEventListener("error", callback);
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

	constructor(lectureID, closeEvent, dueToError) {
		super("close");
		this.lectureID = lectureID;
		this.closeCode = closeEvent.code;
		this.closeReason = closeEvent.reason;
		this.dueToError = dueToError;
	}

}

/**
 * Represents a new message to a live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `messageID` (number)
 * - `body` (string)
 * - `userID` (number?)
 * - `isAnonymous` (boolean)
 * - `time` ({@link Date})
 * - `attachments` (`{id: number, type: string, name: string?}[]`)
 */
class LiveLectureMessageEvent extends Event {

	constructor(lectureID, messageID, data) {
		super("message");
		this.lectureID = lectureID;
		this.messageID = messageID;
		this.body = data.body;
		this.userID = data.userID;
		this.isAnonymous = data.isAnonymous;
		this.time = data.time;
		this.attachments = data.attachments ?? []
	}

}

/**
 * Represents a message update in a live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `messageID` (number)
 * - `body` (string)
 * - `time` ({@link Date})
 */
class LiveLectureMessageUpdatedEvent extends Event {

	constructor(lectureID, messageID, data) {
		super("messageUpdated");
		this.lectureID = lectureID;
		this.messageID = messageID;
		this.body = data.body;
		this.time = data.time;
	}

}

/**
 * Represents a new message being deleted during a live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `messageID` (number)
 */
class LiveLectureMessageDeletedEvent extends Event {

	constructor(lectureID, messageID) {
		super("messageDeleted");
		this.lectureID = lectureID;
		this.messageID = messageID;
	}

}

/**
 * Represents a new poll to a live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `pollID` (number)
 * - `prompt` (string)
 * - `userID` (number?)
 * - `closeDate` (Date?)
 * - `time` ({@link Date})
 * - `choices` (`{ id: number, text: string, correct?: boolean }[]`, won't have correct if not closed)
 */
class LiveLecturePollEvent extends Event {

	constructor(lectureID, pollID, data) {
		super("poll");
		this.lectureID = lectureID;
		this.pollID = pollID;
		this.prompt = data.prompt;
		this.userID = data.userID;
		this.closeDate = data.closeDate;
		this.time = data.time;
		this.hasMultipleAnswers = data.hasMultipleAnswers;
		this.choices = data.choices;
	}

}

/**
 * Represents a poll having some sort of status update in a live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `pollID` (number)
 * - `prompt` (string?)
 * - `choices` (`{ id: number, text: string?, correct: boolean? }[]`?)
 * - `closeDate` (Date?)
 */
class LiveLecturePollUpdatedEvent extends Event {

	constructor(lectureID, pollID, data) {
		super("pollUpdated");
		this.lectureID = lectureID;
		this.pollID = pollID;
		this.prompt = data.prompt;
		this.choices = data.choices;
		this.closeDate = data.closeDate;
	}

}

/**
 * Represents a new question to a live lecture's host. Contains the following properties:
 * - `lectureID` (number)
 * - `questionID` (number)
 * - `question` (string)
 * - `userID` (number?)
 * - `isAnonymous` (boolean)
 * - `time` ({@link Date})
 */
class LiveLectureQuestionEvent extends Event {

	constructor(lectureID, questionID, data) {
		super("question");
		this.questionID = questionID
		this.lectureID = lectureID;
		this.question = data.question;
		this.userID = data.userID;
		this.isAnonymous = data.isAnonymous;
		this.time = data.time;
	}

}

/**
 * Represents the deletion of a question from the live lecture. Contains the following properties:
 * - `lectureID` (number)
 * - `questionID` (number)
 */
class LiveLectureQuestionDeletedEvent extends Event {

	constructor(lectureID, questionID) {
		super("questionDeleted");
		this.questionID = questionID
		this.lectureID = lectureID
	}

}

/**
 * Represents a streamed error message from the backend. Contains the following properties:
 * - `lectureID` (number)
 * - `message` (string)
 * - `time` ({@link Date})
 */
class LiveLectureErrorEvent extends Event {

	constructor(lectureID, msg, time) {
		super("error");
		this.lectureID = lectureID;
		this.message = msg;
		this.time = time;
	}

}

export {
	LiveLectureOpenEvent,
	LiveLectureCloseEvent,
	LiveLectureMessageEvent,
	LiveLectureMessageUpdatedEvent,
	LiveLectureMessageDeletedEvent,
	LiveLecturePollEvent,
	LiveLecturePollUpdatedEvent,
	LiveLectureQuestionEvent,
	LiveLectureQuestionDeletedEvent,
	LiveLectureErrorEvent
};
export default LiveLectureAPI;