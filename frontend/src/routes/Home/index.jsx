/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	02/05/2023
*/

import React from "react";
import { Navigate } from "react-router-dom";

function Root(props) {

	return (
		<Navigate to="/login" />
	);

}

export default Root;