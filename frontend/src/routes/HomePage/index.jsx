import React from "react";
import Popup from 'reactjs-popup';
import { Navigate } from "react-router-dom";
import CourseComponent from "../HomePage/CourseComponent";
import ErrorPage from "../ErrorPage";
import LocalUser from "../../utilities/model/LocalUser";
import CourseAPI from '../../utilities/api/CourseAPI';
import { useState } from "react";

import './style.css';
const courseAPI = new CourseAPI();
import './CourseRegistrationPopup.css';


function HomePage(props) {

	const state = {
		rollID: '',
		url: ''
	}

	const colors = ["red", "blue", "green", "brown"]
	const courses = structuredClone(LocalUser.useValue("courses"));
	
	// Dropdown list generation
	const dropdownList = [];
	for (let i = 0; i < courses.length; i++) {
		dropdownList.push([courses[i], colors[i]]);
	}


	const getURL = async () => {
		const url = document.getElementById("input_url");
		const typed_url = url.value.trim();
		console.log(typed_url);
		if (typed_url == "") {
			console.log("URL is empty.")
			return;
		}
		else{
			const res_addCourse = await courseAPI.addCourseByJoinCode(typed_url);
			if (res_addCourse.accepted){
				LocalUser.current.addCourse(res_addCourse.course);
			}
		}
	}

	return (
		<div className="home-container">
			{dropdownList.map(list => <CourseComponent course={list[0]} color={list[1]} />)}
			<Popup 
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
			</Popup>
		</div>
	);

}

export default HomePage;