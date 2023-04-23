import React from "react";
import SignUpForm from "./SignUpForm";
import SubmitButton from "../Login/SubmitButton";

import DataStore, { useDataStoreValue } from "../../utilities/data/DataStore";
import UserAPI from "../../utilities/api/UserAPI";
import LocalUser from "../../utilities/model/LocalUser";
 
import { Link, Navigate } from "react-router-dom";

import "./style.css";

const userAPI = new UserAPI();

let invalidSessionID = null;

function ProfilePage(props) {

    // If no one is logged in, go to login
	if (LocalUser.current == null) {
		return <Navigate to="/login" />;
	}

    const netID = structuredClone(LocalUser.useValue("netID"));
    // const password = structuredClone(LocalUser.useValue("password"));

	const sessionID = useDataStoreValue("sessionID");

	//If not logged in return...
	return (
		<div className="signup">
			<div className="username-group">
				<div className="username-label">UserID: </div>
				<input className="username-entry">{netID}</input>
			</div>
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default ProfilePage;