/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React from "react";

import Post from "./Post";
import lectureIconImg from "./icons/lecture.png";
import liveIconImg from "./icons/live.png";
import "./styles.css";

function LecturePost(props) {

	// Make tag elements
	const tags = [];
	tags.push(<img key="1" src={lectureIconImg} style={{opacity: 0.5}} />);
	tags.push(<span key="2" className="type">lecture</span>);
	if (props.live) {
		tags.push(<img key="3" src={liveIconImg} />);
		tags.push(<span key="4" className="live">LIVE</span>);
	}

	// Make time string
	let startTimeString = "";
	const elapsedTime = (Date.now() - props.time.getTime()) / 1000;
	if (elapsedTime < 120) {
		startTimeString = " • started now";
	} else if (Date.now() - props.time.getTime() < 7200) {
		startTimeString = " • started recently";
	}

	// Component
	return (
		<Post className={`lecture ${props.live ? "live" : ""}`} link={`lecture/${props.id}`} title={props.title} user={props.user} tagElements={tags} time={props.time}>
			{startTimeString != "" ? <span><strong>Click here to join</strong>{startTimeString}</span> : <span>Click here to view</span>}
		</Post>
	)

}

export default LecturePost;