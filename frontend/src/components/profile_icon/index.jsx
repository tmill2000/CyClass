
import React from "react";
import profilepic from './profileIconIMG.jpg'

import "./style.css";

// Example use:
// <ProfileIcon profile_name="enter some name here" profile_role="enter some role here"></ProfileIcon>

function ProfileIcon(props) {

    return (
        <div className="profile-icon-outline">
            <img className="profile-img" src={profilepic}></img>
            <div className="profile-info">
                <ul className="list-layout">
                    <li className="list-item">
                        <span className="profile-name">{props.profile_name}</span>
                       
                    </li>
                    <li className="list-item">
                        <span className="profile-role">{props.profile_role}</span>
                    </li>
                </ul>
            </div>
        </div>
    );

}

export default ProfileIcon;