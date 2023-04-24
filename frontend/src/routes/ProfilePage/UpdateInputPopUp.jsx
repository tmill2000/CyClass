import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalUser from "../../utilities/model/LocalUser";

import { PopupForm } from "../../components/PopUp";


function UpdateInputPopUp(props){

    const create = (inputs) => {
        let new_username = inputs.newUsername;
        let password = inputs.password;
        return udpateUsername(new_username, password);
    }

    async function udpateUsername(userID, password){
        console.log("&&&&&&&&&&&&&&&&&&&&&&");
        console.log(props);
        const res_addCourse = await props.api.updateUserData(userID, password);
        console.log("here????");
        console.log(res_addCourse);
        if (res_addCourse.accepted){
            // LocalUser.current.addCourse(res_addCourse.course);
        } else{
            throw new Error("Unable to update username");
        }
    
    }
    function getTitle() {
        return "Update " + LocalUser.useValue("netID") + " username: ";
    }

    return (
		<PopupForm
			title="Update Username"
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
