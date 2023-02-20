
import React from "react";
import Button from "../../../components/Button/Button";
import "./style.css";
import FilterBox from "../FilterBox";
import handIcon from "./handIcon.png"

import PollFormPopup from "../../../components/Poll/PollForm/PollFormPopup";

const LiveLectureLeftMenu = (props) => {

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
                    className="button"
                >
                LEAVE
                </Button>
            </div>
            <div className="filter-box-in-left-menu">
                <FilterBox></FilterBox>
            </div>
            <div className="buttons-LLLM">
                <button className="button-LLLM-raise-hand">
                {/* <img src={handIcon} className="hand-icon-LLLM"></img> */}
                RAISE HAND</button>
                <PollFormPopup profile_name={props.userID.name} profile_role={props.userID.role} api={props.lectureAPI}></PollFormPopup>
            </div>
        </div>
    );

}

export default LiveLectureLeftMenu;