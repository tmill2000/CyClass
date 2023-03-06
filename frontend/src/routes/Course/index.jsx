/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React from "react";
import { Navigate, useParams } from "react-router-dom";

import LocalUser from "../../utilities/model/LocalUser";

import ErrorPage from "../ErrorPage";

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


	// Component
	return (
		<div>

		</div>
	);

}

export default Course;