/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	04/21/2023
*/

import React from "react";

import { PopupForm } from "../../components/PopUp";
import CourseAPI from "../../utilities/api/CourseAPI";
import LocalUser from "../../utilities/model/LocalUser";

import "./style.css";

function CreateCoursePopup(props) {

	// Create handler
	const create = (inputs) => {
		
		// Make new lecture, navigating to it if successful and closing otherwise
		return new CourseAPI(null).newCourse(inputs.title, LocalUser.current.userID)
			.then((id) => LocalUser.current.addCourse({
                id: id,
                name: inputs.title,
                role: "Professor"
            }));

	};

	// Component
	return (
		<PopupForm
			title="Create Course"
			enabled={props.visible}
			onClose={props.onClose}
			submitText="CREATE"
			onSubmit={create}
			inputs={[
				{
					label: "Course Title",
					name: "title",
					type: "text",
					validator: (input) => input != ""
				}
			]} />
	);

}

export default CreateCoursePopup;