/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	04/21/2023
 */

import axios from "axios";

import defaultProfileImg from "../../components/ProfileIcon/profileIconIMG.jpg";

const ROLE_MAP = {
	"PROFESSOR": "Professor",
	"TA": "TA",
	"STUDENT": "Student"
};

const userDataCache = {};
const pendingUserIDs = {};

function prettifyRole(backendRole) {
	const prettyRole = ROLE_MAP[backendRole];
	if (prettyRole != null) {
		return prettyRole;
	} else {
		console.error(`Unexpected role for user in course: "${backendRole}"`);
		return backendRole;
	}
}
function sleep(sec) {
	return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

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
				netid: username,
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
					role.role = prettifyRole(role.role);
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
	 * - `displayName`
	 * - `firstName?`
	 * - `lastName?`
	 * - `email?`
	 * - `role?` (always exists if `courseID` is specified)
	 * - `iconURL`
	 * @param {Number} userID 
	 * @param {Number?} courseID course context
	 * @return Promise 
	 */
	getUserData(userID, courseID) {

		// If user ID is part of a pending request, pause and then try again
		if (pendingUserIDs[userID]) {
			return sleep(0.2 + Math.random() * 0.1).then(() => this.getUserData(userID, courseID));
		}

		// Define final data return function
		const getFinalData = () => {
			const userData = userDataCache[userID];
			const result = {
				firstName: userData?.info.firstName,
				lastName: userData?.info.lastName,
				email: userData?.info.email,
				role: courseID != null ? (userData?.roles[courseID] ?? "Student") : null,
				iconURL: defaultProfileImg
			};
			if (result.firstName != null || result.lastName != null) {
				result.displayName = `${result.firstName ?? ""} ${result.lastName ?? ""}`;
			} else {
				result.displayName = result.email;
			}
			return result;
		}

		// Check if already in cache
		const userData = userDataCache[userID];
		if (userData != null) {

			// Check if wants role as well and needs to fetch
			if (courseID != null && userData.roles[courseID] == null) {

				// Peform role fetch
				pendingUserIDs[userID] = true;
				return axios.get("/api/user/role", {
					params: {
						user_id: userID,
						course_id: courseID
					}
				})
					.then((res) => axios.get("/api/role", {
						params: {
							role_id: res.data.role_id
						}
					}))
					.then((res) => {

						// Cache result and return data
						userData.roles[courseID] = prettifyRole(res.data.role);
						pendingUserIDs[userID] = null;
						return getFinalData();

					})
					.catch((err) => {
						pendingUserIDs[userID] = null;
						console.error("Failed to fetch user course role:", err);
						throw err;
					});

			}

			// Otherwise, just return cached info
			return Promise.resolve(getFinalData());

		}

		// Perform fetch
		pendingUserIDs[userID] = true;
		return axios.get("/api/user", {
				params: {
					id: userID
				}
			})
			.then((res) => {

				// Cache main data
				const userData = {
					info: {
						firstName: res.data.first_name,
						lastName: res.data.last_name,
						email: res.data.email
					},
					roles: {}
				};
				userDataCache[userID] = userData;

				// If a course ID was also given, fetch role; otherwise return
				if (courseID != null) {
					return axios.get("/api/user/role", {
						params: {
							user_id: userID,
							course_id: courseID
						}
					})
						.then((res) => axios.get("/api/role", {
							params: {
								role_id: res.data.role_id
							}
						}))
						.then((res) => {

							// Cache result and return data
							userData.roles[courseID] = prettifyRole(res.data.role);
							pendingUserIDs[userID] = null;
							return getFinalData();
	
						});
				}
				pendingUserIDs[userID] = null;
				return getFinalData();

			})
			.catch((err) => {
				pendingUserIDs[userID] = null;
				console.error("Failed to fetch user data:", err);
				throw err;
			})

	}

};

export default UserAPI;