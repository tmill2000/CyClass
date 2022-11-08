/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 */

 import React from "react";
 import Button from "../../components/Button/Button";
 import Checkbox from "../../components/Checkbox/CheckboxWithLabel";
 import DateTimeStamp from "../../components/DateTime/DateTimeStamp";

 import LiveLectureTitle from "../Lectures/LiveLectureTitle";
 import LiveLectureLeftMenu from "../Lectures/LiveLectureLeftMenu";

 function Root(props) {
	
	return (
		<div>
		<LiveLectureTitle lecture_title="Example Title 14" lecture_starttime="14"></LiveLectureTitle>
		<LiveLectureLeftMenu></LiveLectureLeftMenu>
			{/* <h1>Title Text</h1> */}
			{/* <Button
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

			<DateTimeStamp></DateTimeStamp> */}
			
		</div>
	);

 }

 export default Root;