import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalUser from "../../utilities/model/LocalUser";

import { PopupForm } from "../../components/PopUp";


function UpdateInputPopUp(props){

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
    function getTitle() {
        return "Update " + LocalUser.useValue("netID") + " username: ";
    }

    return (
		<PopupForm
			title="Update Username: "
			enabled={props.visible}
			onClose={props.onClose}
			submitText="UPDATE"
			onSubmit={create}
			inputs={[
				{ 
                    label: "Enter new username: ",
					name: "newUsername",
					type: "text",
					validator: (input) => input != ""
				},
                { 
                    label: "Confirm by entering password: ",
					name: "password",
					type: "text",
					validator: (input) => input != ""
				},

            ]} 

        />
    );

}

export default UpdateInputPopUp;
