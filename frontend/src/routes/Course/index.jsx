/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React, { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

import LocalUser from "../../utilities/model/LocalUser";
import CourseAPI from "../../utilities/api/CourseAPI";

import ErrorPage from "../ErrorPage";

import LecturePost from "./LecturePost";
import NewLecturePopUp from "./NewLecturePopUp";
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
	const role = LocalUser.current.getCourseRole(courseID);
	const isElevated = role == "Professor" || role == "TA";

	// Hooks
	const [lectures, setLectures] = useState(null);
	const [error, setError] = useState(null);
	const [newLecturePopup, setNewLecturePopup] = useState(false);
	const navigate = useNavigate();

	// Load lectures
	const api = new CourseAPI(courseID);
	useEffect(() => {
		api.getAllLectures()
			.then((lectures) => setLectures(lectures))
			.catch((err) => {
				if (err.response?.status == 403 || err.response?.status == 401) {
					navigate("/login?expired");
				} else {
					setError(err.response?.status || 500);
				}
			});
	}, [ courseID ]);

	// If an error was set, make page that
	if (error != null) {
		return <ErrorPage code={error} text={"Failed to get lectures"} />
	}

	// Make lectures into posts (unless null)
	const posts = [];
	if (lectures != null) {
		for (const lecture of lectures) {
			posts.push(<LecturePost key={lecture.id} id={lecture.id} title={lecture.title} user={{}} time={lecture.time} live={lecture.live} />);
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
				{isElevated ? <button className="button new-lecture" onClick={() => setNewLecturePopup(!newLecturePopup)}>NEW LECTURE</button> : null }
			</div>
			{isElevated ? <NewLecturePopUp api={api} visible={newLecturePopup} onClose={() => setNewLecturePopup(false)} /> : null }
		</div>
	);

}

export default Course;