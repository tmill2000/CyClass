/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	02/21/2023
 * 
 * PROPS:
 * - messages: object[] (use object from LectureState)
 * - polls: object[] (use object from LectureState)
 */

 import React from "react";

 import Message from "./Message";
 import Poll from "./Poll";
 
 import "./styles.css";
 
 const MAX_CONDENSE_TIME_DIFF = 120; // (seconds)
 
 function LectureFeed(props) {
 
	 // Make list for feed elements
	 const feedList = [];
 
	 // Add messages to feed list, not making the message elements just yet (want to see if can condense first)
	 for (const msg of (props.messages || {})) {
		 feedList.push({
			 type: "msg",
			 msg: msg,
			 element: null,
			 time: msg.time.getTime()
		 });
	 }
 
	 // Add polls to feed list
	 for (const poll of (props.polls || {})) {
		 feedList.push({
			 type: "poll",
			 element: <Poll key={`poll_${poll.id}`} id={poll.id} time={poll.time} prompt={poll.prompt} choices={poll.choices} closed={poll.closed} api={props.api} elevated={props.elevated}/>,
			 time: poll.time.getTime()
		 });
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
			 listEntry.element = <Message key={`msg_${msg.id}`} api={props.api} user={showUser ? msg.user : null} me={msg.me} time={showTime ? msg.time : null} text={msg.text} attachments={msg.attachments} />;
		 }
	 }
 
	 // Component
	 return (
		 <div className="lfeed" style={props.style || {}}>
			 <ul className="feed">
				 {feedList.map(x => x.element)}
			 </ul>
		 </div>
	 );
 
 }
 
 export default LectureFeed; 