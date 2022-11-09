/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	11/06/2022
 */

import React from "react";

import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/CheckboxWithLabel";
import DateTimeStamp from "../../components/DateTime/DateTimeStamp";
import LectureFeed from "../Lecture/LectureFeed";

function Root(props) {

	return (
		<div>
			<h1>Title Text</h1>

			<Button
				onClick={() => {
						console.log("This can be any function!");
				}}
				type="button"
				buttonStyle="btn--post--outline"
				buttonSize="btn--large"
			>
			POST
			</Button>

			<Checkbox label="This is a test!" />

			<DateTimeStamp></DateTimeStamp>

			<LectureFeed style={{position: "absolute", inset: "120px 0px 200px 400px"}} />
			
		</div>
	);

}

export default Root;