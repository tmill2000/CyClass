/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	02/05/2023
 */

import React from "react";
import { Link } from "react-router-dom";

import TimeLabel from "./TimeLabel";
import ProfileIcon from "../../../components/ProfileIcon";

import "./styles.css";

function Poll(props) {

	// Component
	return (
		<div className={`poll ${props.me ? "me" : ""}`}>
			<div>
				<TimeLabel time={props.time}/>
				<div className="post-bubble">
					<div className="poll-header">
						<div className="title-container">
							<div className="container">
								<span className="title">POLL</span>
								<span className="close-time">closes in 2 min</span>
							</div>
							<div className="line" />
						</div>
						<Link className="results-button" to="results">VIEW PARTICIPATION</Link>
					</div>
				</div>
			</div>
			{(props.user != null) ?
			<div className="user-container">
				<ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
			</div>
			: null}
		</div>
	);

}

export default Poll;