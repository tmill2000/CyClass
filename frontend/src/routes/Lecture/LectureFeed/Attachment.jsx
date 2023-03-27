/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/27/2023
 * UPDATED:	03/27/2023
 */

import React from "react";

import imageIconImg from "./icons/image.png";
import pdfIconImg from "./icons/pdf.png";
import fileIconImg from "./icons/file.png";
import "./styles.css";

const ATTACHMENT_ICONS = {
	"image/png": imageIconImg,
	"png": imageIconImg,
	"image/jpg": imageIconImg,
	"jpg": imageIconImg,
	"application/pdf": pdfIconImg,
	"pdf": pdfIconImg,
}
const DEFAULT_ATTACHMENT_ICON = fileIconImg;

let processing = false;

function Attachment(props) {

	// Click handlers
	const download = (e) => {
		if (!processing) {
			processing = true;
			props.api.getAttachment(props.id)
				.then((attachment) => {
					const temp = document.createElement("a");
					temp.style.display = "none";
					temp.href = URL.createObjectURL(attachment);
					temp.download = attachment.name;
					document.body.appendChild(temp);
					temp.click();
					setTimeout(() => {
						URL.revokeObjectURL(temp.href);
						temp.parentNode.removeChild(temp);
					}, 0);
				})
				.finally(() => processing = false);
		}
	};

	// Component
	return (
		<button className="attachment" onClick={download}>
			<img src={ATTACHMENT_ICONS[props.type] ?? DEFAULT_ATTACHMENT_ICON} />
			<div className="info-list">
				<div>Download Attachment</div>
			</div>
		</button>
	);

}

export default Attachment;