/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 */

import React, { useEffect } from "react";

import CourseDropdown from "./CourseDropdown";

import "./styles.css";
import logoImg from "./logo.png";
import UserDropdown from "./UserDropdown";

const TEST_COURSE_LIST = [
	{
		id: 0,
		name: "CPR E 281 - Digital Logic",
		notifs: 13
	},
	{
		id: 1,
		name: "S E 309 - Mitra Squad",
		notifs: 0
	},
	{
		id: 2,
		name: "COM S 336 - Introduction to Computer Graphics",
		notifs: 4
	},
	{
		id: 3,
		name: "S E 491 - Senior Design Part 1",
		notifs: 0,
		current: true
	}
]

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

	// State hooks
	const [currDropdown, setCurrDropdown] = React.useState(null);

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
			<CourseDropdown courses={TEST_COURSE_LIST} expanded={currDropdown == "course"} onClick={(e) => setCurrDropdown(currDropdown == "course" ? null : "course")} />
			<div className="topbar-logo-container">
				<img className="topbar-logo" src={logoImg} />
			</div>
			<UserDropdown name="Student McClass" email="stuclass@iastate.edu" expanded={currDropdown == "user"} onClick={(e) => setCurrDropdown(currDropdown == "user" ? null : "user")} />
		</div>
	);

}

export default TopBar;