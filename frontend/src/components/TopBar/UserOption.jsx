/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 * 
 * PROPS:
 * - icon: string
 * - name: string
 * - href: url
 */

import React from "react";

import "./styles.css";

function UserOption(props) {

	// Component
	return (
		<a className="dropdown-option" href={props.href}>
			<img src={props.icon} />
			<span className="option-title overflow-ellipsis">{props.name}</span>
		</a>
	);

}

export default UserOption;