/**
 * AUTHOR:	Brandon Burt, Adam Walters
 * CREATED:	11/05/2022
 * UPDATED:	02/05/2023
 */

import React from "react";
import LoginForm from "./LoginForm";
import SubmitButton from "./SubmitButton";

import DataStore, { useDataStoreValue } from "../../utilities/data/DataStore";
import UserAPI from "../../utilities/api/UserAPI";
 
import { Link } from "react-router-dom";

 import "./styles.css";

 const userAPI = new UserAPI();

 function Login(props) {

	//API call for user to logout of applcation
	const doLogout = () => {
		try {
			
			const res = userAPI.logout(DataStore.get("sessionID"));
			if (res){
				DataStore.clear("netID");
				DataStore.clear("userID");
				DataStore.clear("sessionID");
			}
		}

		catch(e) {
			console.log(e);
		}
	}

	const sessionID = useDataStoreValue("sessionID");
	if(sessionID){
		return (
			<div className="login">
				<div className="container">
					Welcome {DataStore.get("netID")}

					<Link to="/lecture">
						<SubmitButton
							text={'Go to Lecture'}
							disabled={false}
						/>
					</Link>
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
				<LoginForm />
			</div>
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default Login;