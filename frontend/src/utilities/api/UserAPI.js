/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	11/22/2022
 */

import axios from "axios";

import DataStore from "../data/DataStore";

import defaultProfileImg from "../../components/ProfileIcon/profileIconIMG.jpg";

const userDataCache = {}

/**
 * Interface for the API related to users.
 */
class UserAPI {

	/**
	 * Attempts a login using the given username and password. Will error if a user is already logged in. If successful,
	 * returned Promise will resolve to the following:
	 * - `accepted` - boolean if login was accepted
	 * - `userID` - userID of user, if accepted
	 * - `sessionID` - new sessionID, if accepted
	 * @param {String} username 
	 * @param {String} password 
	 * @return Promise
	 */
	login(username, password) {

		// Make sure no one is logged in
		if (DataStore.get("sessionID") != null) {
			throw new Error("User is already logged in");
		}

		// Perform login
		return axios.post("/api/user/login", {
				netId: username,
				password: password
			})
			.then((res) => {

				// Store
				DataStore.set("userID", rres.data.userId);
				DataStore.set("sessionID", rres.data.sessionId);

				// Return formatted data
				return {
					accepted: true,
					userID: res.data.userId,
					sessionID: res.data.sessionId
				};

			})
			.catch((err) => {

				// Return rejection if due to invalid credentials
				if (err.response?.status == 401) {
					return {
						accepted: false,
						userID: null,
						sessionID: null
					};
				}

				// Otherwise, log and propogate
				console.error("Failed to perform login request:", err);
				throw err;

			});

	}
	
	/**
	 * Fetches the user data for the provided user ID, which will resolve in a Promise to the following if successful:
	 * - `name`
	 * - `role`
	 * - `iconURL`
	 * @param {Number} userID 
	 * @return Promise 
	 */
	getUserData(userID) {

		// Return successful immediately if in cache
		const userData = userDataCache[userID];
		if (userData != null) {
			return Promise.resolve({
				name: userData.email,
				role: "Student",
				iconURL: defaultProfileImg
			});
		}

		// Perform fetch
		return axios.get("/api/user", {
				params: {
					id: userID
				}
			})
			.then((res) => {
				userDataCache[userID] = res.data;
				return {
					name: res.data.email,
					role: "Student",
					iconURL: defaultProfileImg
				};
			})
			.catch((err) => {
				console.error("Failed to fetch user data:", err);
				throw err;
			})

	}

}

export default UserAPI;