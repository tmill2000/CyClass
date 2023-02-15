/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/14/2023
 * UPDATED:	02/14/2023
*/

import React from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

import "./styles.css";

function ErrorPage(props) {

	// Use generated code or manaully specified code/text
	let status = null, statusText = null;
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		status = error.status;
		statusText = error.statusText;
	} else {
		status = props.code;
		statusText = props.text;
	}

	// Return generic or code-specific response
	if (status != null) {
		return (
			<div>
				<h1 className="error-title">Error – {status}</h1>
				<h3 className="error-reason">{statusText}</h3><br />
				<Link className="error-link" to={-1}>Go Back</Link>
			</div>
		);
	}
	return (
		<div>
			<h1 className="error-title">Error</h1>
			<p className="error-reason">:(</p><br />
			<Link className="error-link" to={-1}>Go Back</Link>
		</div>
	);

}

export default ErrorPage;