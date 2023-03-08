import React from "react";
import SignUpForm from "./SignUpForm";
import SubmitButton from "../Login/SubmitButton";

import DataStore, { useDataStoreValue } from "../../utilities/data/DataStore";
import UserAPI from "../../utilities/api/UserAPI";

 
import { Link, Navigate } from "react-router-dom";

 import "./style.css";

 const userAPI = new UserAPI();

 let invalidSessionID = null;

 function SignUp(props) {

	//API call for user to logout of applcation
	const doLogout = () => {
		try {
			
			const res = userAPI.logout(DataStore.get("sessionID"));
			if (res){
				DataStore.clear("netID");
				DataStore.clear("userID");
				DataStore.clear("sessionID");
				DataStore.clear("courses");
			}
		}

		catch(e) {
			console.log(e);
		}
	}

	const sessionID = useDataStoreValue("sessionID");
	if (invalidSessionID == null && new URLSearchParams(window.location.search).has("expired")) {
		invalidSessionID = sessionID
	}
	if (sessionID && sessionID != invalidSessionID) {
		return (
			<div className="login">
				<div className="container">
					Welcome {DataStore.get("netID")}
					<SubmitButton
						text={'Log out'}
						disabled={false}
						onClick={doLogout}
					/>
				</div>
			</div>
		);
	}
	//If not logged in return...
	return (
		<div className="login">
			<div className="container">
				<SignUpForm />
			</div>
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default SignUp;