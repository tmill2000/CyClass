import React from "react";
import Popup from 'reactjs-popup';
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

	// const getURL = async () => {
	// 	const url = document.getElementById("input_url");
	// 	const typed_url = url.value.trim();
	// 	console.log(typed_url);
	// 	if (typed_url == "") {
	// 		console.log("URL is empty.")
	// 		return;
	// 	}
	// 	else{
	// 		const res_addCourse = await courseAPI.addCourseByJoinCode(typed_url);
	// 		console.log(")))))))))))))))");
	// 		console.log(res_addCourse);
	// 		if (res_addCourse.accepted){
	// 			LocalUser.current.addCourse(res_addCourse.course);
	// 		}
	// 	}
	// }

	function closePopUp(){
		setAddCoursePopup(false);
	}

	return (
		<div className="home-container">
			{dropdownList.map(list => <CourseComponent course={list[0]} color={list[1]} />)}
			<button className="add-course-button" onClick={() => setAddCoursePopup(true)}>+</button>
			<AddCoursePopUp visible={addCoursePopup} api={courseAPI}  onClose={() => closePopUp()}></AddCoursePopUp>
			{/* <Popup 
				trigger={<button className="add-course-button">+</button>}
				modal
				nested
			>
				<div className="course-reg-popup">
					<button className="close" onClick={close}>&times;</button>
					<div className="header"> Add a Course: </div>
					<div className="course-reg-input-group">
						<div className="course-reg-input-label"></div>
						<input id="input_url" className="course-reg-input-field"></input>
					</div>

					<div className="actions">
					<button className="button"
						onClick={() => {
							getURL();
						}}>Add Course</button>
					</div>
				</div>
			</Popup> */}
		</div>
	);

}

export default HomePage;