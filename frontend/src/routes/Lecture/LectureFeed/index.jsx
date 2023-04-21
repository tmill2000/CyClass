/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	04/21/2023
 * 
 * PROPS:
 * - messages: object[] (use object from LectureState)
 * - polls: object[] (use object from LectureState)
 */

import React, { useRef } from "react";

import Message from "./Message";
import Poll from "./Poll";

import "./styles.css";

const MAX_CONDENSE_TIME_DIFF = 120; // (seconds)

let canFetchMore = true;

function LectureFeed(props) {

	// Make list for feed elements
	const feedList = [];

	// Add messages to feed list, not making the message elements just yet (want to see if can condense first)
	let oldestMsgTime = null;
	for (const msg of (props.messages || {})) {
		feedList.push({
			type: "msg",
			msg: msg,
			element: null,
			time: msg.time.getTime()
		});
		if (oldestMsgTime == null || msg.time.getTime() < oldestMsgTime.getTime()) {
			oldestMsgTime = msg.time;
		}
	}

	// Add polls to feed list
	let oldestPollTime = null;
	for (const poll of (props.polls || {})) {
		feedList.push({
			type: "poll",
			element: <Poll key={`poll_${poll.id}`} id={poll.id} time={poll.time} prompt={poll.prompt} choices={poll.choices} closeDate={poll.closeDate} api={props.api} elevated={props.elevated} multipleSelect={poll.hasMultipleAnswers}/>,
			time: poll.time.getTime()
		});
		if (oldestPollTime == null || poll.time.getTime() < oldestPollTime.getTime()) {
			oldestPollTime = poll.time;
		}
	}

	// Sort feed list by time
	feedList.sort((x, y) => x.time - y.time)

	// Now that the feed list ordering is known, go through messages in feed list and generate condensed elements
	for (let i = 0; i < feedList.length; i++) {
		const listEntry = feedList[i];
		if (listEntry.type == "msg") {
			let showUser = true, showTime = true;
			const msg = listEntry.msg
			if (i > 0) {
				const prevEntry = feedList[i - 1];
				if (prevEntry.type == "msg" && prevEntry.msg.user.id == msg.user.id && listEntry.time - prevEntry.time < MAX_CONDENSE_TIME_DIFF * 1000) {
					showTime = false;
				}
			}
			if (i < feedList.length - 1) {
				const nextEntry = feedList[i + 1];
				if (nextEntry.type == "msg" && nextEntry.msg.user.id == msg.user.id && nextEntry.time - listEntry.time < MAX_CONDENSE_TIME_DIFF * 1000) {
					showUser = false;
				}
			}
			listEntry.element = <Message key={`msg_${msg.id}`} id={msg.id} api={props.api} elevated={props.elevated} showUser={showUser} user={msg.user} me={msg.me} time={showTime ? msg.time : null} text={msg.text} attachments={msg.attachments} />;
		}
	}

	// Define handler for auto-loading more messages/polls
	// (for timestamp, picks the newest of the msg/poll oldest, also ensuring it is older than the last fetch)
	const lastFetchTS = useRef(null);
	let oldestTime = null;
	if (oldestMsgTime != null && oldestPollTime == null) {
		oldestTime = oldestMsgTime;
	} else if (oldestPollTime != null && oldestMsgTime == null) {
		oldestTime = oldestPollTime;
	} else if (oldestMsgTime != null && oldestPollTime != null) {
		if (oldestMsgTime.getTime() > oldestPollTime.getTime()) {
			oldestTime = (lastFetchTS.current == null || oldestMsgTime.getTime() < lastFetchTS.current.getTime()) ? oldestMsgTime : oldestPollTime;
		} else {
			oldestTime = (lastFetchTS.current == null || oldestPollTime.getTime() < lastFetchTS.current.getTime()) ? oldestPollTime : oldestMsgTime;
		}
	}
	const fetchMore = () => {
		if (canFetchMore && oldestTime != null && (lastFetchTS.current == null || oldestTime.getTime() < lastFetchTS.current.getTime())) { // (won't fetch if last fetch was equivalent or older)
			canFetchMore = false;
			props.api.fetchHistory(oldestTime)
				.then(() => lastFetchTS.current = oldestTime)
				.finally(() => canFetchMore = true);
		}
	};

	// Component
	return (
		<div className="lfeed" style={props.style || {}} onScroll={(e) => { if (e.target.scrollTop < -e.target.scrollHeight + e.target.clientHeight + 100) fetchMore() }}>
			<ul className="feed">
				{feedList.map(x => x.element)}
			</ul>
		</div>
	);

}

export default LectureFeed; 