import React from "react";
import { useNavigate } from "react-router-dom";


const CourseComponent = (props) => {

    const navigate = useNavigate();

    return (
        <button className="cc-container" style={{'backgroundColor': props.color}} onClick={(e) => navigate(`/course/${props.course.id}`)}>
            <div className="cc-title">{props.course.name}</div>
        </button>
    );

}

export default CourseComponent;