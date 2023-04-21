import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileIcon from '../../../components/ProfileIcon'
import CourseAPI from "../../../utilities/api/CourseAPI";

import "./style.css";

const LiveLectureTitle = (props) => {

    // Hooks
    const [lectureInfo, setLectureInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        // Load lecture info
        new CourseAPI(props.courseID).getLectureInfo(props.lectureID)
            .then((info) => {
                setLectureInfo(info);
            })
            .catch(() => {
                setLectureInfo({
                    title: "Live Lecture",
                    time: new Date()
                });
            });

    }, []);

    return (
        <div className="live-lecture-outline">
            <button className="standard button" onClick={() => navigate(`/course/${props.courseID}`)}>LEAVE</button>
            <div className="title-section">
                <div className="title">{lectureInfo?.title ?? "Loading..."}</div>
                <div className="time">{lectureInfo != null ? (lectureInfo?.time?.toAbsoluteString() ?? new Date().toAbsoluteString()) : ""}</div>
            </div>
            <div className="host-section">
                <div className="host-by">HOSTED BY</div>
                <div className="host-container">
                    {lectureInfo?.host != null ? <ProfileIcon profile_name={lectureInfo.host.name} profile_role={lectureInfo.host.role} flipped={true} /> : null }
                </div>
            </div>
        </div>
    );

}

export default LiveLectureTitle;