/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	02/05/2023
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

import Message from "./Message";
import Poll from "./Poll";

import "./styles.css";

const MAX_CONDENSE_TIME_DIFF = 120; // (seconds)

function LectureFeed(props) {

	// Preprocess messages, condensing if neighboring messages are from the same person and similar times
	const messages = (props.messages || {}).map((x) => x).sort((x, y) => x.time - y.time);
	const feedList = [];
	for (let i = 0; i < messages.length; i++) {
		let showUser = true, showTime = true;
		const msg = messages[i];
		if (i > 0) {
			const prevMsg = messages[i - 1];
			if (prevMsg.user.id == msg.user.id && msg.time - prevMsg.time < MAX_CONDENSE_TIME_DIFF * 1000) {
				showTime = false;
			}
		}
		if (i < messages.length - 1) {
			const nextMsg = messages[i + 1];
			if (nextMsg.user.id == msg.user.id && nextMsg.time - msg.time < MAX_CONDENSE_TIME_DIFF * 1000) {
				showUser = false;
			}
		}
		feedList.push(<Message user={showUser ? msg.user : null} time={showTime ? msg.time : null} text={msg.text} me={msg.me} />);
	}

	// Component
	return (
		<div className="lfeed" style={props.style || {}}>
			<div className="feed">
				{feedList}
				<Poll time={Date.now()} user={{ name: "Test User", role: "Student" }} />
			</div>
		</div>
	);

}

export default LectureFeed;