/**
 * AUTHOR:	Brandon Burt
 * CREATED:	11/05/2022
 * UPDATED:	11/05/2022
 */

 import React from "react";
 import { observer } from 'mobx-react';
 import UserStore from "./stores/UserStore";
 import LoginForm from "./LoginForm";
 import SubmitButton from "./SubmitButton";

 import PopUp from "../../components/PopUp/PopUp";
 
import { Link } from "react-router-dom";

 import "./styles.css";
import PollFormHeader from "../../components/Poll/PollForm/PollFormHeader";
import PollFormPopup from "../../components/Poll/PollForm/PollFormPopup";

 function Login(props) {
	
	//API call to check if the user is logged in or not
	async function componentDidMount(){
		try {
			let res = await fetch('/isLoggedIn', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			let result = await res.json();

			if (result && result.success){
				UserStore.loading = false;
				UserStore.isLoggedIn = true;
				UserStore.netid = result.netid;
			}
			else {
				UserStore.loading = false;
				UserStore.isLoggedIn = false;

			}

		}

		catch(e) {
			UserStore.loading = false;
			UserStore.isLoggedIn = false;
		}
	}

	//API call for user to logout of applcation
	async function doLogout(){
		try {
			let res = await fetch('/logout', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			let result = await res.json();

			if (result && result.success){
				UserStore.isLoggedIn = false;
				UserStore.netid = '';
			}
	
		}

		catch(e) {
			console.log(e);
		}
	}
	//If logged in return...
	if(UserStore.isLoggedIn){
		return (
			<div className="login">
				<div className="container">
					Welcome {UserStore.netid}

					<Link to="/lecture">
						<SubmitButton
							text={'Go to Lecture'}
							disabled={false}
						/>
					</Link>
					<SubmitButton
						text={'Log out'}
						disabled={false}
						onClick={ () => this.doLogout() }
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
				<PollFormPopup profile_name="Maruf" profile_role="Professor"></PollFormPopup>
				{/* <PopUp header=<PollFormHeader profile_name="Maruf" profile_role="Professor"></PollFormHeader> 
				trigger_button_name="Create Poll" content=<PollFormBody></PollFormBody> submit_button_name="Post Poll"></PopUp> */}
			</div>
		</div>
	);

 }

 //observer() allows app to listen to changes in the UserStore
 export default observer(Login);