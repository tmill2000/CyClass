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

import UserOption from "./UserOption";

import "./styles.css";
import userBadgeImg from "./userbadge.png";

function UserDropdown(props) {

	// State hooks
	const [hovering, setHovering] = React.useState(false);

	// Dynamic styles
	const dropdownStyle = {
		height: props.expanded ? `calc(100% + ${203}px)` : "100%" 
	};
	const dropdownTopStyle = {
		backgroundColor: props.expanded ? "#484848" : (hovering ? "#404040" : "#363636")
	};

	// Component
	return (
		<div className="topbar-dropdown topbar-user-dropdown" style={dropdownStyle}>
			<div className="topbar-dropdown-top" style={dropdownTopStyle} onClick={props.onClick} onMouseEnter={(e) => setHovering(true)} onMouseLeave={(e) => setHovering(false)}>
				<div className="topbar-dropdown-image-container">
				</div>
				<div className="topbar-user-info-container">
					<span className="topbar-user-info topbar-user-info-name overflow-ellipsis">{props.name}</span>
					<span className="topbar-user-info topbar-user-info-email overflow-ellipsis">{props.email}</span>
				</div>
				<div className="topbar-dropdown-image-container">
					<img className="topbar-user-badge" src={userBadgeImg}/>
				</div>
			</div>
			<div className="topbar-dropdown-bottom">
				<UserOption icon={userBadgeImg} name="Account" href="/account" />
				<div className="topbar-dropdown-separator" />
				<UserOption icon={userBadgeImg} name="Courses" href="/" />
				<div className="topbar-dropdown-separator" />
				<UserOption icon={userBadgeImg} name="Settings" href="/settings" />
				<div className="topbar-dropdown-separator" />
				<a className="topbar-dropdown-option" style={{color: "#555", textAlign: "right"}} href="/">
					<span className="topbar-dropdown-option-title overflow-ellipsis">Log Out</span>
				</a>
			</div>
		</div>
	);

}

export default UserDropdown;