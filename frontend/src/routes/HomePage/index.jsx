import React from "react";
import { Navigate } from "react-router-dom";
import CourseComponent from "../HomePage/CourseComponent";
// import { useParams } from "react-router-dom";
import DataStore from '../../utilities/data/DataStore';
import ErrorPage from "../ErrorPage";

import './style.css';
import CourseRegistrationPopup from "./CourseRegistrationPopUp";

function HomePage(props) {
	const colors = ["red", "blue", "green", "brown"]

	const courses = structuredClone(LocalUser.useValue("courses"));
	// Dropdown list generation
	const dropdownList = [];
	for (let i = 0; i < courses.length; i++) {
		dropdownList.push(<CourseComponent courseTitle={courses[i]} color={colors[i]} />);
	}
	// Get lecture and course IDs from path params and validate them
	// const pathParams = useParams();
	// const lectureID = parseInt(pathParams.lectureID);
	// if (isNaN(lectureID)) {
	// 	return <ErrorPage code={400} text="Invalid lecture number" />;
	// }
	// const courseID = parseInt(pathParams.courseID);
	// if (isNaN(courseID)) {
	// 	return <ErrorPage code={400} text="Invalid course number" />;
	// }

	// Get user ID and permission level, verifying logged-in
	// const userID = DataStore.get("userID");
	// if (userID == null) {
	// 	return <Navigate to="/login" />;
	// }
	// let isElevatedUser = false;
	// for (const course of JSON.parse(DataStore.get("courses") || "[]")) {
	// 	if (course.id == courseID) {
	// 		isElevatedUser = course.role == "PROFESSOR" || course.role == "TA"
	// 		break;
	// 	}
	// }

	return (
		<div className="home-container">
			<CourseRegistrationPopup></CourseRegistrationPopup>
			{dropdownList}
		</div>
	);

}

export default HomePage;