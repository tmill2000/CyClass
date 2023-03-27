/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/27/2023
 * UPDATED:	03/27/2023
 */

import React from "react";

import "./styles.css";

function Attachment(props) {

	// Click handlers
	const download = (e) => {
		props.api.downloadAttachment(props.id);
	};

	// Component
	return (
		<button className="attachment" onClick={download}>
			<span>Download Attachment</span>
		</button>
	);

}

export default Attachment;