/**
 * AUTHOR:	Adam Walters
 * CREATED:	04/15/2023
 * UPDATED:	04/15/2023
*/

import React, { useState } from "react";

import RaiseHandPopup from "./RaiseHandPopup";
import PollPopup from "./PollPopup";
import "./styles.css";
import handIconImg from "./handIcon.png";

function SidePanel(props) {

	// State
	const [raiseHandPopupVisible, setRaiseHandPopupVisible] = useState(false);
	const [pollPopupVisible, setPollPopupVisible] = useState(false);

	// Component
	return (
		<div className="sidebar">
			<div className="sidebar-container">
				<div> {/* placeholder; needed for space-between which allows for content-based sizing */} </div>
				<div className="button-container">
					<button className="img-button button" onClick={() => setRaiseHandPopupVisible(true)}><img src={handIconImg} /></button>
					{props.elevated ? <button className="poll-button standard button" onClick={() => setPollPopupVisible(true)}>POST POLL</button> : null }
				</div>
			</div>
			{props.elevated ? <PollPopup visible={pollPopupVisible} api={props.api} courseID={props.courseID} lectureID={props.lectureID} onClose={() => setPollPopupVisible(false)} /> : null}
			<RaiseHandPopup api={props.api} visible={raiseHandPopupVisible} onClose={() => setRaiseHandPopupVisible(false)} />
		</div>
	);

}

export default SidePanel;