/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	11/06/2022
 * 
 * PROPS:
 * - messages: Message[]
 * 
 * OBJECT FORMAT:
 * - Message: {
 *       user: {
 *           id: number,
 *           name: string,
 *           role: string,
 *       },
 *       me: boolean,
 *       text: string,
 *       time: number    <= UTC timestamp (milliseconds)
 *   }
 */

import React from "react";

import LectureMessage from "./LectureMessage";

import "./styles.css";

const TEST_USER = {
	id: 1,
	name: "Billy Bob",
	role: "Student"
};
const TEST_MESSAGE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae est ac lectus posuere molestie vel nec libero. Suspendisse id cursus arcu, in malesuada tortor. Sed quis pellentesque mauris, sed pellentesque quam. Mauris sit amet tellus faucibus, tristique nisi eu, faucibus odio. Nulla ac pretium urna. In mauris sem, molestie ut massa vitae, gravida fermentum sapien. Etiam aliquam risus a magna ultrices posuere. Aliquam erat volutpat.`;
const TEST_TIMESTAMP = 1667406940000;

const TEST_MESSAGES = [
	{
		user: TEST_USER,
		text: "short message",
		time: Date.now(),
		me: true
	},
	{
		user: TEST_USER,
		text: "short message",
		time: Date.now() - 3600000 * 1
	},
	{
		user: TEST_USER,
		text: "short message",
		time: Date.now() - 3600000 * 2,
		me: true
	},
	{
		user: TEST_USER,
		text: "short message",
		time: Date.now() - 3600000 * 2,
		me: true
	},
	{
		user: TEST_USER,
		text: "short message",
		time: Date.now() - 3600000 * 4,
		me: true
	},
	{
		user: TEST_USER,
		text: TEST_MESSAGE,
		time: Date.now() - 3600000 * 5,
		me: true
	},
	{
		user: TEST_USER,
		text: TEST_MESSAGE,
		time: Date.now() - 3600000 * 25,
		me: true
	},
	{
		user: TEST_USER,
		text: TEST_MESSAGE,
		time: TEST_TIMESTAMP
	},
	{
		user: TEST_USER,
		text: TEST_MESSAGE,
		time: TEST_TIMESTAMP
	},
]

const MAX_CONDENSE_TIME_DIFF = 120; // (seconds)

function LectureFeed(props) {

	// Preprocess messages, condensing if neighboring messages are from the same person and similar times
	const messages = (props.messages || TEST_MESSAGES).map((x) => x).sort((x, y) => x.time < y.time);
	const feedList = [];
	for (let i = 0; i < messages.length; i++) {
		let showUser = true, showTime = true;
		const msg = messages[i];
		if (i > 0) {
			const nextMsg = messages[i - 1];
			if (nextMsg.user.id == msg.user.id && nextMsg.time - msg.time < MAX_CONDENSE_TIME_DIFF * 1000) {
				showUser = false;
			}
		}
		if (i < messages.length - 1) {
			const prevMsg = messages[i + 1];
			if (prevMsg.user.id == msg.user.id && msg.time - prevMsg.time < MAX_CONDENSE_TIME_DIFF * 1000) {
				showTime = false;
			}
		}
		feedList.push(<LectureMessage user={showUser ? msg.user : null} time={showTime ? msg.time : null} text={msg.text} me={msg.me} />);
	}

	// Component
	return (
		<div className="lfeed-container" style={props.style || {}}>
			<div className="lfeed-feed">
				{feedList}
			</div>
		</div>
	);

}

export default LectureFeed;