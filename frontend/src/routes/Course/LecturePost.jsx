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

	// Component
	return (
		<Post className={`lecture ${props.live ? "live" : ""}`} link={`lecture/${props.id}`} title={props.title} user={props.user} tagElements={tags} time={props.time}>
			<span><strong>Click here to join</strong> • started {props.time.toRelativeString()}</span>
		</Post>
	)

}

export default LecturePost;