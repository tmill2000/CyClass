 import React from "react";
 import { observer } from 'mobx-react';
 import "./styles.css";

 function Register(props) {
	
	return (
		<div className="register">
			<div className="container">
				<RegistrationForm />
			</div>
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default observer(Register);