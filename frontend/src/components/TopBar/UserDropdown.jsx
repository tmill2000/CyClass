/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 * 
 * PROPS:
 * - name: string
 * - email: string
 */

import React from "react";
import { useNavigate } from "react-router-dom";

import LocalUser from "../../utilities/model/LocalUser";

import UserOption from "./UserOption";

import "./styles.css";
import userBadgeImg from "./userbadge.png";

function UserDropdown(props) {

	// State hooks
	const [hovering, setHovering] = React.useState(false);
	const navigate = useNavigate();

	// Dynamic styles
	const dropdownStyle = {
		height: props.expanded ? `calc(100% + ${203}px)` : "100%" 
	};
	const dropdownTopStyle = {
		backgroundColor: props.expanded ? "#484848" : (hovering ? "#404040" : "#363636")
	};

	// Functions
	const toggleLogin = () => {
		if (props.name != null) {
			LocalUser.logout();
		}
		navigate("/login");
	};

	const navigateProfile = () => {
		navigate("/profile");
	}

	// Component
	return (
		<div className="dropdown user-dropdown" style={dropdownStyle}>
			<div className="top-container" style={dropdownTopStyle} onClick={props.onClick} onMouseEnter={(e) => setHovering(true)} onMouseLeave={(e) => setHovering(false)}>
				<div className="image-container">
				</div>
				<div className="user-info-container">
					<span className="user-info info-name overflow-ellipsis">{props.name || "Not Logged In"}</span>
					<span className="user-info info-email overflow-ellipsis">{props.email}</span>
				</div>
				<div className="image-container">
					<img className="user-badge" src={userBadgeImg}/>
				</div>
			</div>
			<div className="bottom-container">
				<UserOption icon={userBadgeImg} name="Account" href="/account" />
				<div className="separator" />
				{/* <UserOption icon={userBadgeImg} name="Courses" href="/" />
				<div className="separator" />
				<UserOption icon={userBadgeImg} name="Settings" href="/settings" />
				<div className="separator" /> */}
				<button className="dropdown-option" style={{color: "#555", textAlign: "right"}} onClick={toggleLogin}>
					<span className="option-title overflow-ellipsis">{props.name != null ? "Log Out" : "Log In"}</span>
				</button>
			</div>
		</div>
	);

}

export default UserDropdown;