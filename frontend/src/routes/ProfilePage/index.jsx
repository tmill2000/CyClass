import React, { useEffect, useState } from "react";

import DataStore, { useDataStoreValue } from "../../utilities/data/DataStore";
import UserAPI from "../../utilities/api/UserAPI";
import LocalUser from "../../utilities/model/LocalUser";
 
import { Link, Navigate } from "react-router-dom";

import "./style.css";
import UpdateInputPopUp from "./UpdateInputPopUp";

const userAPI = new UserAPI();

let invalidSessionID = null;

function ProfilePage(props) {

	const [updatePopup, setUpdatePopup] = useState(false);

    // If no one is logged in, go to login
	if (LocalUser.current == null) {
		return <Navigate to="/login" />;
	}

    const userID = LocalUser.useValue("userID");
	const netID = LocalUser.useValue("netID");

	// const sessionID = useDataStoreValue("sessionID");

	function closePopUp(){
		setUpdatePopup(false);
	}

	//If not logged in return...
	return (
		<div className="signup">
			<div className="username-group">
				<div className="username-label">NetID: </div>
				<div className="username-entry">{netID}</div>
			</div>
			<div className="username-group">
				<div className="username-label">UserID: </div>
				<div className="username-entry">{userID}</div>
				<button className="standard button" onClick={() => setUpdatePopup(true)}>edit</button>
				<UpdateInputPopUp visible={updatePopup} api={userAPI}  onClose={() => closePopUp()}></UpdateInputPopUp>
			</div>
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default ProfilePage;