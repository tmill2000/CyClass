import React, { createRef } from "react";
import Popup from 'reactjs-popup';


import CourseComponent from "./CourseComponent";

import './CourseRegistrationPopup.css';
import DataStore from '../../utilities/data/DataStore';
import CourseAPI from '../../utilities/api/CourseAPI';
    
const courseAPI = new CourseAPI();
// const input_url = createRef();

class CourseRegistrationPopUp extends React.Component {

    constructor(props) {
        this.state = {
            rollID: '',
            url: ''
        }
    }


    getURL = async () => {
        const typed_url = "";
        if (typed_url == "") {
            console.log("URL is empty.")
            return;
        }
        else{
            const res_addCourse = await courseAPI.addCourseByUrl(state.url);
            if (res_addCourse.accepted){
                DataStore.set("rollID", res_addCourse.rollID);
            }
        }
    }

    render() {
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
                        <input  className="course-reg-input-field" id="crURL"></input>
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
}

export default CourseRegistrationPopUp;

const ColoredLine = ({ color, height }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: height
      }}
  />
);



