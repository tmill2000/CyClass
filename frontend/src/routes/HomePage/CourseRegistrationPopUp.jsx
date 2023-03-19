import React, { createRef } from "react";
import Popup from 'reactjs-popup';


import CourseComponent from "./CourseComponent";

import './CourseRegistrationPopup.css';
import DataStore from '../../utilities/data/DataStore';
import CourseAPI from '../../utilities/api/CourseAPI';


export default function CourseRegistrationPopup(props){
    
    const courseAPI = new CourseAPI();
    const input_url = createRef();

    this.state = {
        rollID: '',
        url: ''
    }

    getURL = async () => {
        const typed_url = input_url.current.value.trim();
        if (props.api == null || typed_url == "") {
            console.log("URL is empty.")
            return;
        }
        else{
            const res_addCourse = await courseAPI.addCourseByUrl(this.state.url);
            if (res_addCourse.accepted){
                DataStore.set("rollID", res_addCourse.rollID);
            }
        }
    }

    return (
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
                    <input ref={input_url} className="course-reg-input-field" id="crURL"></input>
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
    );
}


const ColoredLine = ({ color, height }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: height
      }}
  />
);



