import React from "react";
import { Navigate } from "react-router-dom";
import CourseComponent from "../HomePage/CourseComponent";
import { useParams } from "react-router-dom";

import ErrorPage from "../ErrorPage";

import './style.css';

function HomePage(props) {

	// Get lecture and course IDs from path params and validate them
	const pathParams = useParams();
	const lectureID = parseInt(pathParams.lectureID);
	if (isNaN(lectureID)) {
		return <ErrorPage code={400} text="Invalid lecture number" />;
	}
	const courseID = parseInt(pathParams.courseID);
	if (isNaN(courseID)) {
		return <ErrorPage code={400} text="Invalid course number" />;
	}

	// Get user ID and permission level, verifying logged-in
	const userID = DataStore.get("userID");
	if (userID == null) {
		return <Navigate to="/login" />;
	}
	let isElevatedUser = false;
	for (const course of JSON.parse(DataStore.get("courses") || "[]")) {
		if (course.id == courseID) {
			isElevatedUser = course.role == "PROFESSOR" || course.role == "TA"
			break;
		}
	}

	return (
		<div className="home-container">
			<CourseComponent color="red" courseTitle="Com S 492"></CourseComponent>
			<CourseComponent color="blue" courseTitle="Com S 417"></CourseComponent>
		</div>
	);

}

export default HomePage;