/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	03/06/2023
 * 
 * PROPS:
 * - courses: Course[]
 * 
 * OBJECT FORMAT:
 * - Course: {
 *       id: name,
 *       name: name,
 *       notifs: number
 *   }
 */

import React from "react";

import CourseOption from "./CourseOption";

import "./styles.css";
import arrowImg from "./arrow.png";

const COURSE_HEIGHT = 50;
const COURSE_SEPARATOR_HEIGHT = 1;

function CourseDropdown(props) {

	// State hooks
	const [hovering, setHovering] = React.useState(false);

	// Dropdown list generation
	const dropdownList = [];
	let dropdownListHeight = 0;
	for (let i = 0; i < props.courses.length; i++) {
		dropdownList.push(<CourseOption key={i} course={props.courses[i]} />);
		dropdownListHeight += COURSE_HEIGHT;
		if (i < props.courses.length - 1) {
			dropdownList.push(<div key={-i - 1} className="topbar-dropdown-separator" />);
			dropdownListHeight += COURSE_SEPARATOR_HEIGHT;
		}
	}

	// Look for current course
	let currCourseTitle = "View Courses"
	for (const course of props.courses) {
		if (course.current) {
			currCourseTitle = course.name
			break;
		}
	}

	// Dynamic styles
	const dropdownStyle = {
		height: props.expanded ? `calc(100% + ${dropdownListHeight}px)` : "100%" 
	};
	const dropdownTopStyle = {
		backgroundColor: props.expanded ? "#484848" : (hovering ? "#404040" : "#363636")
	};
	const arrowStyle = {
		transform: props.expanded ? "translate(-50%, -50%) rotate(90deg)" : "translate(-50%, -50%)"
	};

	// Component
	return (
		<div className="dropdown course-dropdown" style={dropdownStyle}>
			<div className="top-container" style={dropdownTopStyle} onClick={props.onClick} onMouseEnter={(e) => setHovering(true)} onMouseLeave={(e) => setHovering(false)}>
				<div className="image-container">
					<img className="dropdown-arrow" src={arrowImg} style={arrowStyle}/>
				</div>
				<span className="dropdown-title overflow-ellipsis">{currCourseTitle}</span>
			</div>
			<div className="bottom-container">
				{dropdownList}
			</div>
		</div>
	);

}

export default CourseDropdown;