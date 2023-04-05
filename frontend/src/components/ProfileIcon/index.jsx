
import React from "react";
import profilepic from './profileIconIMG.jpg'

import "./style.css";

// Example use:
//<ProfileIcon profile_name="Jaden Ciesielski" profile_role="Student" width="500px"></ProfileIcon>

const ProfileIcon = (props) => {

    return (
        <div className="profile-icon-outline" style={{width: props.width}}>
            {props.flipped ? null: <img className="profile-img" src={profilepic}></img>}
            <div className="profile-info">
                <ul className="list-layout"> 
                    <li className="list-item">
                        {props.flipped ? <span className="profile-name-flipped">{props.profile_name}</span> : <span className="profile-name">{props.profile_name}</span> }
                    </li>
                    <li className="list-item">
                        {props.flipped ? <span className="profile-role-flipped">{props.profile_role}</span> : <span className="profile-role">{props.profile_role}</span> }
                    </li>
                </ul>
            </div>
            
            {props.flipped ? <img className="profile-img" src={profilepic}></img> : null}
        </div>
    );

}

export default ProfileIcon;