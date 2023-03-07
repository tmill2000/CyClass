/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import LocalUser from "../../utilities/model/LocalUser";
import CourseAPI from "../../utilities/api/CourseAPI";

import ErrorPage from "../ErrorPage";

import LecturePost from "./LecturePost";
import "./styles.css";

function Course(props) {

	// Get course ID from URL
	const pathParams = useParams();
	const courseID = parseInt(pathParams.courseID);
	if (isNaN(courseID)) {
		return <ErrorPage code={400} text="Invalid course number" />;
	}

	// Verify logged-in and in course
	const userID = LocalUser.current?.userID;
	if (userID == null) {
		return <Navigate to="/login" />;
	} else if (!LocalUser.current.isInCourse(courseID)) {
		return <ErrorPage code={403} text="You are not a member of that course" />;
	}

	// Hooks
	const [lectures, setLectures] = useState(null);
	const [error, setError] = useState(null);

	// Load lectures
	useEffect(() => {
		const api = new CourseAPI(courseID);
		api.getAllLectures()
			.then((lectures) => setLectures(lectures))
			.catch((err) => setError("Failed to get lectures"));
	}, [ courseID ]);

	// If an error was set, make page that
	if (error != null) {
		return <ErrorPage code={500} text={error} />
	}

	// Make lectures into posts (unless null)
	const posts = [];
	if (lectures != null) {
		for (const lecture of lectures) {
			posts.push(<LecturePost key={lecture.id} id={lecture.id} title={lecture.title} user={{}} time={new Date()} live={lecture.live} />);
		}
	}

	// Sort posts by time
	posts.sort((x, y) => x.props.time > y.props.time);

	// Component
	return (
		<div className="page course">
			<div className="filter-panel">
			</div>
			<div className="feed">
				{lectures != null ? posts : <div style={{textAlign: "center", fontSize: "1.5em", fontStyle: "italic"}}>Loading ...</div>}
			</div>
			<div className="create-panel">
			</div>
		</div>
	);

}

export default Course;