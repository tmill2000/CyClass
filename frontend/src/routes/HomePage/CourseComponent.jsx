import React from "react";


const CourseComponent = (props) => {

    return (
        <div className="cc-container" style={{'backgroundColor': props.color}}>
            <div className="cc-title">{props.courseTitle}</div>
        </div>
    );

}

export default CourseComponent;