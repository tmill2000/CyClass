import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import LocalUser from "../../utilities/model/LocalUser";

import CourseComponent from "./CourseComponent";
import AddCoursePopUp from "./AddCoursePopUp";
import CreateCoursePopup from "./CreateCoursePopup";
import './style.css';
import './CourseRegistrationPopup.css';

const ADMIN_COURSE_ID = 4;

function HomePage(props) {

	// If no one is logged in, go to login
	if (LocalUser.current == null) {
		return <Navigate to="/login" />;
	}

	const [addCoursePopupVisible, setAddCoursePopupVisible] = useState(false);
	const [createCoursePoupVisible, setCreateCoursePoupVisible] = useState(false);

	const courseList = structuredClone(LocalUser.useValue("courses"));
	const isAdmin = courseList.find(x => x.id == ADMIN_COURSE_ID) != null;

	const colors = ["red", "blue", "green", "brown"]
	// const courses = structuredClone(LocalUser.useValue("courses"));
	
	const dropdownList = [];
	for (let i = 0; i < courseList.length; i++) {
		dropdownList.push([courseList[i], colors[i]]);
	}

	return (
		<div className="home-container">
			{dropdownList.map(list => <CourseComponent course={list[0]} color={list[1]} />)}
			<button className="add-course-button" onClick={() => setAddCoursePopupVisible(true)}>+</button>
			{isAdmin ? <button className="add-course-button" onClick={() => setCreateCoursePoupVisible(true)}>CREATE</button> : null}
			{isAdmin ? <CreateCoursePopup visible={createCoursePoupVisible} onClose={() => setCreateCoursePoupVisible(false)} /> : null}
			<AddCoursePopUp visible={addCoursePopupVisible} onClose={() => setAddCoursePopupVisible(false)} />
		</div>
	);

}

export default HomePage;