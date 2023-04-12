import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PopupForm } from "../../components/PopUp";


function AddCoursePopUp(props){

    const create = (inputs) => {
        let joinCode = inputs.joinCode;
        addCourse(joinCode);
        props.onClose();
    }

    async function addCourse(joinCode){
        console.log(")))))))))))))))");
        console.log(props);
        const res_addCourse = await props.api.addCourseByJoinCode(joinCode);
        console.log(")))))))))))))))");
        console.log(res_addCourse);
        if (res_addCourse.accepted){
            let x = 1;
            // LocalUser.current.addCourse(res_addCourse.course);
        }
        else{
            console.log("incorrect join code");
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
