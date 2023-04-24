/**
 * AUTHOR:	Brandon Burt, Adam Walters
 * CREATED:	11/05/2022
 * UPDATED:	03/06/2023
 */
import React from "react";
import LoginForm from "./LoginForm";
import SubmitButton from "./SubmitButton";

import LocalUser from "../../utilities/model/LocalUser";

 import "./styles.css";

 let invalidSessionID = null;

 function Login(props) {

	//API call for user to logout of applcation
	const doLogout = () => {
		try {
			LocalUser.logout();
		}

		catch(e) {
			console.log(e);
		}
	}

	const sessionID = LocalUser.useValue("sessionID");
	if (invalidSessionID == null && new URLSearchParams(window.location.search).has("expired")) {
		invalidSessionID = sessionID
	}
	
	if (sessionID && sessionID != invalidSessionID && LocalUser.current != null) {
		return (
			<div className="login">
				<div className="container">
					Welcome {LocalUser.current.userInfo.firstName ?? LocalUser.current.userInfo.displayName}

					{/* <Link to="/lecture">
						<SubmitButton
							text={'Go to Lecture'}
							disabled={false}
						/>
					</Link> */}
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