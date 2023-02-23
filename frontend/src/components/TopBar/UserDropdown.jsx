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
import { Link, useNavigate } from "react-router-dom";

import UserAPI from "../../utilities/api/UserAPI";

import UserOption from "./UserOption";

import "./styles.css";
import userBadgeImg from "./userbadge.png";
import DataStore from "../../utilities/data/DataStore";

const userAPI = new UserAPI();

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
			userAPI.logout(DataStore.get("sessionID"))
				.finally(() => navigate("/login"));
		} else {
			navigate("/login");
		}
	};

	// Component
	return (
		<div className="topbar-dropdown topbar-user-dropdown" style={dropdownStyle}>
			<div className="topbar-dropdown-top" style={dropdownTopStyle} onClick={props.onClick} onMouseEnter={(e) => setHovering(true)} onMouseLeave={(e) => setHovering(false)}>
				<div className="topbar-dropdown-image-container">
				</div>
				<div className="topbar-user-info-container">
					<span className="topbar-user-info topbar-user-info-name overflow-ellipsis">{props.name || "Not Logged In"}</span>
					<span className="topbar-user-info topbar-user-info-email overflow-ellipsis">{props.email}</span>
				</div>
				<div className="topbar-dropdown-image-container">
					<img className="topbar-user-badge" src={userBadgeImg}/>
				</div>
			</div>
			<div className="topbar-dropdown-bottom">
				{/* <UserOption icon={userBadgeImg} name="Account" href="/account" />
				<div className="topbar-dropdown-separator" />
				<UserOption icon={userBadgeImg} name="Courses" href="/" />
				<div className="topbar-dropdown-separator" />
				<UserOption icon={userBadgeImg} name="Settings" href="/settings" />
				<div className="topbar-dropdown-separator" /> */}
				<button className="topbar-dropdown-option" style={{color: "#555", textAlign: "right"}} onClick={toggleLogin}>
					<span className="topbar-dropdown-option-title overflow-ellipsis">{props.name != null ? "Log Out" : "Log In"}</span>
				</button>
			</div>
		</div>
	);

}

export default UserDropdown;