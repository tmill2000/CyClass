/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	02/14/2023
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
 *       time: Date
 *   }
 */

import React from "react";

import Message from "./Message";
import Poll from "./Poll";

import "./styles.css";

const MAX_CONDENSE_TIME_DIFF = 120; // (seconds)

function LectureFeed(props) {

	// Preprocess messages, condensing if neighboring messages are from the same person and similar times
	const messages = (props.messages || {}).map((x) => x).sort((x, y) => x.time.getTime() - y.time.getTime());
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
				<Poll
					id={1}
					time={new Date()}
					user={{ name: "Test User", role: "Student" }}
					prompt="If temperature diffuses uniformly and water boils at 100 degrees Celsius, what is the precise circumference of the Sun within 3 significant digits?"
					options={[
						{
							choiceID: 1,
							text: "5.23 x 10^5"
						},
						{
							choiceID: 2,
							text: "9.72 x 10^15"
						},
						{
							choiceID: 3,
							text: "2.45 x 10^25"
						},
						{
							choiceID: 4,
							text: "2"
						}
					]}
					selected={4}
					correct={null}
					api={props.api}
				/>
			</div>
		</div>
	);

}

export default LectureFeed;