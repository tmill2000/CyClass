/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 * 
 * PROPS:
 * - courses: Course[]
 * 
 * OBJECT FORMAT:
 * - Course: {
 *       id: name,
 *       title: name,
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
		dropdownList.push(<CourseOption course={props.courses[i]} />);
		dropdownListHeight += COURSE_HEIGHT;
		if (i < props.courses.length - 1) {
			dropdownList.push(<div className="topbar-dropdown-separator" />);
			dropdownListHeight += COURSE_SEPARATOR_HEIGHT;
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
		<div className="topbar-dropdown topbar-course-dropdown" style={dropdownStyle}>
			<div className="topbar-dropdown-top" style={dropdownTopStyle} onClick={props.onClick} onMouseEnter={(e) => setHovering(true)} onMouseLeave={(e) => setHovering(false)}>
				<div className="topbar-dropdown-image-container">
					<img className="topbar-dropdown-arrow" src={arrowImg} style={arrowStyle}/>
				</div>
				<span className="topbar-dropdown-title overflow-ellipsis">S E 491 - Senior Design Part 1</span>
			</div>
			<div className="topbar-dropdown-bottom">
				{dropdownList}
			</div>
		</div>
	);

}

export default CourseDropdown;