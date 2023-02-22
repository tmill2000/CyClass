/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 */

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDataStoreValue } from "../../utilities/data/DataStore";

import CourseDropdown from "./CourseDropdown";

import "./styles.css";
import logoImg from "./logo.png";
import UserDropdown from "./UserDropdown";

function isDescendant(parent, descendant) {
	for (const child of parent.children) {
		if (child === descendant || isDescendant(child, descendant)) {
			return true;
		}
	}
	return false;
}

function TopBar(props) {

	// Refs
	const topBarRef = React.createRef();

	// Various hooks
	const [currDropdown, setCurrDropdown] = React.useState(null);
	const courses = JSON.parse(useDataStoreValue("courses") || "[]");
	const location = useLocation();
	const netID = useDataStoreValue("netID");

	// Get course list and decide on current using URL
	let currCourse = null;
	const currCourseResult = /course\/([0-9]+)/.exec(location.pathname);
	if (currCourseResult != null) {
		currCourse = parseInt(currCourseResult[1]);
	}
	for (const course of courses) {
		course.notifs = 0;
		course.current = course.id == currCourse;
	}

	// Effects
	useEffect(() => {
		let onClick = (e) => {
			if (!isDescendant(topBarRef.current, e.target)) {
				setCurrDropdown(null);
			}
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	});

	// Component
	return (
		<div ref={topBarRef} className="topbar">
			<CourseDropdown courses={courses} expanded={currDropdown == "course"} onClick={(e) => setCurrDropdown(currDropdown == "course" ? null : "course")} />
			<div className="topbar-logo-container">
				<img className="topbar-logo" src={logoImg} />
			</div>
			<UserDropdown name={netID} email="" expanded={currDropdown == "user"} onClick={(e) => setCurrDropdown(currDropdown == "user" ? null : "user")} />
		</div>
	);

}

export default TopBar;