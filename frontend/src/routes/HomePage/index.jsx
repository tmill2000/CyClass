import React from "react";
import Popup from 'reactjs-popup';
import { Navigate } from "react-router-dom";
import CourseComponent from "../HomePage/CourseComponent";
import ErrorPage from "../ErrorPage";
import LocalUser from "../../utilities/model/LocalUser";
import CourseAPI from '../../utilities/api/CourseAPI';

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
		dropdownList.push(<CourseComponent courseTitle={courses[i]} color={colors[i]} />);
	}


    const getURL = async () => {
		const url = document.getElementById("input_url");
        const typed_url = url.current.value.trim();
        if (typed_url == "") {
            console.log("URL is empty.")
            return;
        }
        else{
            const res_addCourse = await courseAPI.addCourseByUrl(state.url);
            if (res_addCourse.accepted){
                LocalUser.set("rollID", res_addCourse.rollID);
            }
        }
    }

	return (
		<div className="home-container">
			<Popup 
                trigger={<CourseComponent  color="gray" courseTitle="+"></CourseComponent>}
                modal
                nested
            >
                {close => (
                <div className="course-reg-popup">
                    <button className="close" onClick={close}>&times;</button>
                    <div className="header"> Add A Course: </div>
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
                )}   
            </Popup>
			{dropdownList}
		</div>
	);

}

export default HomePage;