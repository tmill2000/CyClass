import React from "react";

import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/CheckboxWithLabel";
import DateTimeStamp from "../../components/DateTime/DateTimeStamp";
import LectureFeed from "../Lecture/LectureFeed";
import LiveLectureTitle from "./LiveLectureTitle";
import LiveLectureLeftMenu from "./LiveLectureLeftMenu";


function Lecture(props) {
	
	return (
		<div>
            <LiveLectureTitle lecture_title="Example Title 14" lecture_starttime="14"></LiveLectureTitle>

            <LiveLectureLeftMenu></LiveLectureLeftMenu>

			<LectureFeed style={{position: "absolute", inset: "120px 0px 200px 400px"}} />
			
		</div>
	);

}

export default Lecture;