/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	04/25/2023
 * 
 * PROPS:
 * - icon: string
 * - name: string
 * - href: url
 */

import React from "react";

import "./styles.css";
import { Link } from "react-router-dom";

function UserOption(props) {

	// Component
	return (
		<Link className="dropdown-option" to={props.href}>
			<img src={props.icon} />
			<span className="option-title overflow-ellipsis">{props.name}</span>
		</Link>
	);

}

export default UserOption;