
import React, { useState } from "react";

import Button from "../../../components/Button/Button";
// import PollFormPopup from "../../../components/Poll/PollForm/PollFormPopup";
import PollTypePopUp from "../../../components/PollType/PollTypePopUp";

import FilterBox from "./FilterBox";
import RaiseHandPopup from "./RaiseHandPopup";
import "./style.css";

import handIcon from "./handIcon.png"

function SidePanel(props) {

	// State
	const [raiseHandPopupVisible, setRaiseHandPopupVisible] = useState(false);
	const [pollPopup, setPollPopup] = useState(false);

	return (
		<div className="left-menu-container">
			<div className="button-LLLM">
				<Button
					onClick={() => {
						console.log("This can be any function!");
					}}
					type="button"
					buttonStyle="btn--newComment--solid"
					buttonSize="btn--medium"
					className="button-left-menu"
				>
				LEAVE
				</Button>
			</div>
			<div className="filter-box-in-left-menu">
				<FilterBox></FilterBox>
			</div>
			<div className="buttons-LLLM">
				<button className="button-LLLM-raise-hand" onClick={() => setRaiseHandPopupVisible(true)}>
					<img src={handIcon} className="hand-icon-LLLM" />
				</button>
				{props.elevated ? <button className="button-poll-popup" onClick={() => setPollPopup(!pollPopup)}>POST POLL</button> : null }
			</div>
			{props.elevated ? <PollTypePopUp visible={pollPopup} api={props.api} courseID={props.courseID} lectureID={props.lectureID} onClose={() => setPollPopup(false)}></PollTypePopUp> : null}
			<RaiseHandPopup api={props.api} visible={raiseHandPopupVisible} onClose={() => setRaiseHandPopupVisible(false)} />
		</div>
	);

}

export default SidePanel;