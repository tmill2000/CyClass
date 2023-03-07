/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	03/06/2023
 * 
 * PROPS:
 * - course: Course
 * 
 * OBJECT FORMAT:
 * - Course: (see CourseDropdown.jsx)
 */

import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";

function CourseOption(props) {

	// Dynamic styles
	const notifExtraClass = (props.course.notifs || 0) > 0 ? "topbar-dropdown-course-notifs-nonzero" : "topbar-dropdown-course-notifs-zero";

	// Component
	return (
		<Link className="topbar-dropdown-option" to={`/course/${props.course.id || 0}`}>
			<span className={`topbar-dropdown-course-notifs ${notifExtraClass}`}>{props.course.notifs || 0}</span>
			<span className="topbar-dropdown-option-title overflow-ellipsis">{props.course.name || "???"}</span>
		</Link>
	);

}

export default CourseOption;