/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
*/

import React from "react";
import { Link } from "react-router-dom";

import ProfileIcon from "../../components/ProfileIcon";

import "./styles.css";

function Post(props) {

	// Component
	return (
		<Link className={`post ${props.className || ""}`} to={props.link}>
			<div className="container">
				<div className="top">
					<div className="title-container">
						<div className="tags">
							{props.tagElements}
						</div>
						<div className="title">
							<span className="selectable">{props.title}</span>
						</div>
					</div>
					<ProfileIcon profile_name={props.user.name} profile_role={props.user.role} flipped={true} />
				</div>
				<div className="content">
					{props.children}
				</div>
				<div className="bottom">
					<span className="footer-text">{props.footerText}</span>
					<span className="timestamp">{props.time.toRelativeString()}</span>
				</div>
			</div>
		</Link>
	)

}

export default Post;