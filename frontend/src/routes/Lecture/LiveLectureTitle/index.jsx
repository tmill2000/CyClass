import React from "react";
import ProfileIcon from '../../../components/ProfileIcon'
import Button from "../../../components/Button/Button";
import "./style.css";

const LiveLectureTitle = (props) => {

    return (
        <div className="live-lecture-outline">
            <ul className="list-layout1">
                <li className="list-item1">
                    <span className="host-by">HOSTED BY:</span>
                </li>
                <li className="list-item">
                    <ProfileIcon profile_name={props.userIDname} profile_role={props.userIDrole} width="300px"></ProfileIcon>
                </li>
            </ul>
            <div className="title-section">
                <ul className="list-layout">
                    <li className="list-item-title">
                        <span>{props.lecture_title}</span>
                    </li>
                    <li className="list-item-starttime">
                        <span className="lecture-time">Started {props.lecture_starttime} minutes ago</span>
                    </li>
                </ul>
            </div>
            <div className="button-section">
                <Button
                    onClick={() => {
                        console.log("This can be any function!");
                    }}
                    type="button"
                    buttonStyle="btn--cancel--solid"
                    buttonSize="btn--medium"
                >
                CLOSE LECTURE
                </Button>
            </div>
        </div>
    );

}

export default LiveLectureTitle;