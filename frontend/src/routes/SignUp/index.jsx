import React from "react";
import SignUpForm from "./SignUpForm";

import { Navigate } from "react-router-dom";
import LocalUser from "../../utilities/model/LocalUser";

 import "./style.css";

 function SignUp(props) {

	// If already signed in, redirect to home page
	if (LocalUser.current != null) {
		return <Navigate to="/home" />
	}
	return (
		<div className="signup">
			<SignUpForm />
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default SignUp;