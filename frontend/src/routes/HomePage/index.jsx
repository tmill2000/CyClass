import React from "react";
import { Navigate } from "react-router-dom";
import CourseComponent from "../HomePage/CourseComponent";
import ErrorPage from "../ErrorPage";
import LocalUser from "../../utilities/model/LocalUser";
import CourseAPI from '../../utilities/api/CourseAPI';
import { useState } from "react";
import AddCoursePopUp from "./AddCoursePopUp";

import './style.css';
const courseAPI = new CourseAPI();
import './CourseRegistrationPopup.css';


function HomePage(props) {

	// If no one is logged in, go to login
	if (LocalUser.current == null) {
		return <Navigate to="/login" />;
	}

	const [addCoursePopup, setAddCoursePopup] = useState(false);

	const courseList = structuredClone(LocalUser.useValue("courses"));

	const colors = ["red", "blue", "green", "brown"]
	// const courses = structuredClone(LocalUser.useValue("courses"));
	
	const dropdownList = [];
	function createDropDownList(){
		// Dropdown list generation
		for (let i = 0; i < courseList.length; i++) {
			dropdownList.push([courseList[i], colors[i]]);
		}
	}

	createDropDownList();

	function closePopUp(){
		setAddCoursePopup(false);
	}

	return (
		<div className="home-container">
			{dropdownList.map(list => <CourseComponent course={list[0]} color={list[1]} />)}
			<button className="add-course-button" onClick={() => setAddCoursePopup(true)}>+</button>
			<AddCoursePopUp visible={addCoursePopup} api={courseAPI}  onClose={() => closePopUp()}></AddCoursePopUp>
		</div>
	);

}

export default HomePage;