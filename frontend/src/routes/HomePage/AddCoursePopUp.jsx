import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalUser from "../../utilities/model/LocalUser";

import { PopupForm } from "../../components/PopUp";


function AddCoursePopUp(props){

    const create = (inputs) => {
        let joinCode = inputs.joinCode;
        return addCourse(joinCode);
    }

    async function addCourse(joinCode){
        const res_addCourse = await props.api.addCourseByJoinCode(joinCode);
        if (res_addCourse.accepted){
            LocalUser.current.addCourse(res_addCourse.course);
        } else{
            throw new Error("Invalid join code");
        }
    }

    return (
		<PopupForm
			title="Add A Course"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="ADD"
			onSubmit={create}
			inputs={[
				{ 
                    label: "Enter Join Code: ",
					name: "joinCode",
					type: "text",
					validator: (input) => input != ""
				},

            ]} 

        />
    );

}

export default AddCoursePopUp;
