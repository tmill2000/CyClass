/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	03/06/2023
 */

import axios from "axios";

import defaultProfileImg from "../../components/ProfileIcon/profileIconIMG.jpg";

const ROLE_MAP = {
	"PROFESSOR": "Professor",
	"TA": "TA",
	"STUDENT": "Student"
};

const userDataCache = {};

/**
 * Interface for the API related to users.
 */
class UserAPI {

	/**
	 * Attempts a login using the given username and password. If successfully, the returned Promise will resolve to the
	 * following object:
	 * - `accepted` - boolean if login was accepted
	 * - `userID` - userID of user, if accepted
	 * @param {String} username 
	 * @param {String} password 
	 * @param {String} firstname 
	 * @param {String} lastname 
	 * @return Promise
	 */
	signup(username, password, firstname, lastname) {

		// Perform signup
		return axios.post("/api/user", {
				netId: username,
				password: password,
				first_name: firstname,
				last_name: lastname
			})
			.then((res) => {

				// Return formatted data
				return {
					accepted: true,
					userID: res.data.userId
				};

			})
			.catch((err) => {

				// Return rejection if cannot connect to DB
				if (err.response?.status == 401) {
					return {
						accepted: false,
						userID: null,
					};
				}

				// Otherwise, log and propogate
				console.error("Failed to perform signup:", err);
				throw err;

			});

	}

	/**
	 * Attempts a login using the given username and password. If successfully, the returned Promise will resolve to the
	 * following object:
	 * - `accepted` - boolean if login was accepted
	 * - `userID` - userID of user, if accepted
	 * - `sessionID` - new sessionID, if accepted
	 * - `courses` - `{ id: number, name: string, role: string }[]` (if accepted)
	 * @param {String} username 
	 * @param {String} password 
	 * @return Promise
	 */
	login(username, password) {

		// Perform login
		return axios.post("/api/user/login", {
				netId: username,
				password: password
			})
			.then((res) => {

				// Make role strings more readable
				for (const role of res.data.userRoles) {
					const prettyRole = ROLE_MAP[role.role];
					if (prettyRole != null) {
						role.role = prettyRole;
					} else {
						console.error(`Unexpected role for user in course "${role.name}": ${role.role}`);
					}
				}

				// Return formatted data
				return {
					accepted: true,
					userID: res.data.userId,
					sessionID: res.data.sessionId,
					courses: res.data.userRoles.map(role => ({
						id: role.course_id,
						name: role.course_name,
						role: role.role
					}))
				};

			})
			.catch((err) => {

				// Return rejection if due to invalid credentials
				if (err.response?.status == 401) {
					return {
						accepted: false,
						userID: null,
						sessionID: null,
						courses: null
					};
				}

				// Otherwise, log and propogate
				console.error("Failed to perform login:", err);
				throw err;

			});

	}

	/**
	 * Attempts a logout of the given session. If successful, returned Promise will resolve to a boolean describing if
	 * the request was successful.
	 * @param {String} sessionID 
	 * @return Promise
	 */
	logout(sessionID) {

		// Perform logout
		return axios.post("/api/user/logout", {})
			.then((res) => {

				// Return success
				return true;

			})
			.catch((err) => {

				// Return failure if due to invalid session
				if (err.response?.status == 403) {
					return false;
				}

				// Otherwise, log and propogate
				console.error("Failed to perform logout:", err);
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

};

export default UserAPI;