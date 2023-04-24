import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalUser from "../../utilities/model/LocalUser";

import { PopupForm } from "../../components/PopUp";


function UpdateInputPopUp(props){

    const user = LocalUser.useValue("userInfo");

    const create = (inputs) => {
        console.log("hi");
        
        console.log(user);
        let password1 = inputs.password1;
        let password2 = inputs.password1;
        let password = inputs.oldPassword;
        let firstname = inputs.firstname;
        let lastname = inputs.lastname;
        if (password1 != password2){
            console.log("New Passwords do not match.");
        }
        else {
            if (password1 == "" || password1 == null){
                
            }
            else{
                console.log("using new password");
                password = password1;
            }
        }
        if (firstname == "" || firstname == null){
            console.log("using old firstname ");
            firstname = user.firstName;
        }
        if (lastname == "" || lastname == null){
            lastname = user.lastName;
        }


        return udpateUsername(firstname, lastname, inputs.email, password);
    }

    async function udpateUsername(firstname, lastname, userID, password){
        console.log("&&&&&&&&&&&&&&&&&&&&&&");
        console.log(props);
        const res_addCourse = await props.api.updateUserData(firstname, lastname, userID, password);
        console.log("here????");
        console.log(res_addCourse);
        if (res_addCourse.accepted){
            // LocalUser.current.addCourse(res_addCourse.course);
        } else{
            throw new Error("Unable to update username");
        }
    
    }
    // function getTitle() {
    //     // return "Update " + LocalUser.useValue("netID") + " username: ";
    // }

    return (
		<PopupForm
			title="Update Password"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="UPDATE"
			onSubmit={create}
			inputs={[
                { 
                    label: "Enter Email: ",
					name: "email",
					type: "text",
					validator: (input) => input != ""
				},
                { 
                    label: "Enter new first name if you want to change it, leave blank otherwise:  ",
					name: "firstname",
					type: "text"
				},
                { 
                    label: "Enter new last name if you want to change it, leave blank otherwise:  ",
					name: "lastname",
					type: "text"
				},
                { 
                    label: "Enter password: ",
					name: "oldPassword",
					type: "password",
					validator: (input) => input != ""
				},
				{ 
                    label: "Enter new password if you want to change it, leave blank otherwise: ",
					name: "password1",
					type: "password"
				},
                { 
                    label: "Confirm new password if you want to change it, leave blank otherwise: ",
					name: "password2",
					type: "password"
				}

            ]} 

        />
    );

}

export default UpdateInputPopUp;
