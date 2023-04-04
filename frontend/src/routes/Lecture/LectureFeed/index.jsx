/**
 * AUTHOR:	Adam Walters
 * CO-AUTHOR: Brandon Burt
 * CREATED:	11/06/2022
 * UPDATED:	02/21/2023, 04/02/2023
 * 
 * PROPS:
 * - messages: object[] (use object from LectureState)
 * - polls: object[] (use object from LectureState)
 */

import React, { useEffect } from "react";

import Message from "./Message";
import Poll from "./Poll";
import { getLecture } from "../../../../../server/api/lecture/getLecture";
import { getPolls } from "../../../../../server/api/poll/getPolls";
import "./styles.css";

const MAX_CONDENSE_TIME_DIFF = 120; // (seconds)

function LectureFeed(props) {
	/**
	 * Defining a state variable called 'messages' with the 'useState' hook that sets the 
	 * initial value to either the array of messages passed as a prop to the 'LectureFeed'
	 * component or an empty array if no messages were passed. The 'setMessages' function
	 * can be used to update the value of 'messages' later on in the component.
	 */
	const [messages, setMessages] = useState(props.messages || []);

	const [polls, setPolls] = useState(props.polls || []);

	// Add edit and delete functionality to messages
    const handleEdit = (id, newText) => {
        // Find the message with the corresponding id and update its text
        const updatedMessages = messages.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    text: newText
                };
            }
            return msg;
        });
        setMessages(updatedMessages);
    };

	const handleDelete = (id) => {
        // Remove the message with the corresponding id from the messages list
        const updatedMessages = messages.filter(msg => msg.id !== id);
        setMessages(updatedMessages);
    };

	// define functions to handle changes in the poll prompt and choices
	const handlePromptChange = (id, newPrompt) => {
		const updatedPolls = polls.map(poll => {
		  if (poll.id === id) {
			return {
			  ...poll,
			  prompt: newPrompt
			};
		  }
		  return poll;
		});
		setPolls(updatedPolls);
	  };

	  const handleChoicesChange = (id, newChoices) => {
		const updatedPolls = polls.map(poll => {
		  if (poll.id === id) {
			return {
			  ...poll,
			  choices: newChoices
			};
		  }
		  return poll;
		});
		setPolls(updatedPolls);
	  };

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
			element: <Poll key={`poll_${poll.id}`} id={poll.id} time={poll.time} prompt={poll.prompt} choices={poll.choices} closed={poll.closed} api={props.api} elevated={props.elevated} onPromptChange={(newPrompt) => handlePromptChange(poll.id, newPrompt)} onChoicesChange={(newChoices) => handleChoicesChange(poll.id, newChoices)}/>,
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
			listEntry.element = <Message key={`msg_${msg.id}`} api={props.api} user={showUser ? msg.user : null} me={msg.me} time={showTime ? msg.time : null} text={msg.text} attachments={msg.attachments} onEdit={(newText) => handleEdit(msg.id, newText)} onDelete={() => handleDelete(msg.id)} elevated={props.elevated} />;
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