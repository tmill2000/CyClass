/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/21/2023
 * UPDATED:	04/15/2023
 */

import LiveLectureAPI from "../../utilities/api/LiveLectureAPI";
import UserAPI from "../../utilities/api/UserAPI";

import { showErrorToast } from "../../components/Toast";

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
	questions = []
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
				time: event.time,
				attachments: event.attachments
			});

			// Update version
			this.setStateVersion(++this.version);

		});
		this.api.onMessageUpdated(async (event) => {

			// Look for message in array
			const index = this.messages.findIndex(x => x.id == event.messageID);
			if (index >= 0) {

				// Update object
				if (event.body != null) {
					this.messages[index].text = event.body;
				}

				// Update version
				this.setStateVersion(++this.version);

			}

		});
		this.api.onMessageDeleted(async (event) => {

			// Look for message in array
			const index = this.messages.findIndex(x => x.id == event.messageID);
			if (index >= 0) {

				// Remove
				this.messages[index] = this.messages[this.messages.length - 1];
				this.messages.pop();

				// Update version
				this.setStateVersion(++this.version);

			}

		});
		this.api.onPoll(async (event) => {

			// Add to polls array
			this.polls.push({
				id: event.pollID,
				user: await toUserInfo(event.userID, false),
				me: event.userID == this.userID,
				prompt: event.prompt,
				choices: event.choices,
				closeDate: event.closeDate,
				time: event.time,
				hasMultipleAnswers: event.hasMultipleAnswers
			});

			// Update version
			this.setStateVersion(++this.version);

		});
		this.api.onPollUpdated(async (event) => {

			// Look for poll in array
			const index = this.polls.findIndex(x => x.id == event.pollID);
			if (index >= 0) {

				// Update object
				if (event.closeDate != null) {
					this.polls[index].closeDate = event.closeDate;
				}
				if (event.prompt != null) {
					this.polls[index].prompt = event.prompt;
				}
				if (event.choices != null) {
					for (const choice of event.choices) {
						const choiceIndex = this.polls[index].choices.findIndex(x => x.id == choice.id);
						if (choiceIndex >= 0) {
							this.polls[index].choices[choiceIndex].text = choice.text;
						} else {
							console.error(`Failed to update poll: missing choice with ID ${choice.id}`);
						}
					}
				}

				// Update version
				this.setStateVersion(++this.version);

			}

		});
		this.api.onQuestion(async (event) => {

			// Add to questions
			this.questions.push({
				id: event.questionID,
				question: event.question,
				user: await toUserInfo(event.userID, event.isAnonymous),
				time: event.time
			});

			// Update version
			this.setStateVersion(++this.version);

		});
		this.api.onQuestionDeleted(async (event) => {

			// Find in list, if exists
			const index = this.questions.findIndex(e => e.id == event.questionID);
			if (index >= 0) {

				// Remove
				this.questions[index] = this.questions[this.questions.length - 1];
				this.questions.pop();

				// Update version
				this.setStateVersion(++this.version);

			}

		});
		this.api.onError((event) => {

			// Show as toast
			showErrorToast(event.message);

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

	start(setStateVersionHook, navigateHook) {

		// Store hooks
		this.setStateVersion = setStateVersionHook
		this.navigate = navigateHook

		// Begin accepting messages if not live
		if (!this.api.isLive()) {
			this.api.fetchHistory()
				.catch((err) => {
					if (err?.response?.status == 403) {
						this.navigate("/login?expired");
					}
				});
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