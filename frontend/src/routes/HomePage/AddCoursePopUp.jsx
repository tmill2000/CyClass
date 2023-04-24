import React from "react";

import { PopupForm } from "../../components/PopUp";
import LocalUser from "../../utilities/model/LocalUser";
import CourseAPI from "../../utilities/api/CourseAPI";


function AddCoursePopUp(props){

    const create = (inputs) => {
        let joinCode = inputs.joinCode;
        return addCourse(joinCode);
    }

    async function addCourse(joinCode){
        const res_addCourse = await new CourseAPI(null).joinCourseByJoinCode(joinCode);
        if (res_addCourse.accepted){
            LocalUser.current.addCourse(res_addCourse.course);
        } else{
            throw new Error("Invalid join code");
        }
    }

    return (
		<PopupForm
			title="Join a Course"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="JOIN"
			onSubmit={create}
			inputs={[
				{ 
                    label: "Join Code",
					name: "joinCode",
					type: "text",
					validator: (input) => input != ""
				},

            ]} 

        />
    );

}

export default AddCoursePopUp;
