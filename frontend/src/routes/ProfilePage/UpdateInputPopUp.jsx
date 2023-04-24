import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalUser from "../../utilities/model/LocalUser";

import { PopupForm } from "../../components/PopUp";


function UpdateInputPopUp(props){

    const create = (inputs) => {
        let password1 = inputs.password1;
        let password2 = inputs.password1;
        if (password1 != password2){
            console.log("New Passwords do not match.");
        }
        let username = inputs.username;

        return udpateUsername(username, password);
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
			title="Update Password"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="UPDATE"
			onSubmit={create}
			inputs={[
                { 
                    label: "Enter in Username: ",
					name: "username",
					type: "text",
					validator: (input) => input != ""
				},
                { 
                    label: "Enter old password: ",
					name: "oldPassword",
					type: "password",
					validator: (input) => input != ""
				},
				{ 
                    label: "Enter new password: ",
					name: "password1",
					type: "password",
					validator: (input) => input != ""
				},
                { 
                    label: "Confirm new password: ",
					name: "password2",
					type: "password",
					validator: (input) => input != ""
				},

            ]} 

        />
    );

}

export default UpdateInputPopUp;
