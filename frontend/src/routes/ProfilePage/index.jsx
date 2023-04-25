import React from "react";
import { Navigate } from "react-router-dom";

import { showToast } from "../../components/Toast";
import UserAPI from "../../utilities/api/UserAPI";
import LocalUser from "../../utilities/model/LocalUser";

import AccountField from "./AccountField";
import "./style.css";

function ProfilePage(props) {

    // If no one is logged in, go to login
	if (LocalUser.current == null) {
		return <Navigate to="/login" />;
	}

	// State
	const userInfo = LocalUser.useValue("userInfo");

	// Handler
	const api = new UserAPI();
	const updateInfo = (key, value) => {
		api.updateUserData(LocalUser.current.userID, {[key]: value})
			.then(() => showToast("Updated successfully.", 3, "#FFF", "#0C0"))
			.finally(() => LocalUser.current.refreshUserInfo());
	};

	// Component
	return (
		<div className="page account">
			<h1>Account</h1>
			<div className="field-container">
				<AccountField label={"First Name"} current={userInfo.firstName} onEdit={(x) => updateInfo("firstName", x)} />
				<AccountField label={"Last Name"} current={userInfo.lastName} onEdit={(x) => updateInfo("lastName", x)} />
				<AccountField label={"Password"} secret={true} onEdit={(x) => updateInfo("password", x)} />
			</div>
		</div>
	);

}

export default ProfilePage;