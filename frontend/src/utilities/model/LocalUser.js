/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	04/21/2023
 */

import UserAPI from "../api/UserAPI";
import DataStore, { useDataStoreValue } from "../data/DataStore";

const MISSING = "_m_";
const VERSION = 1;

let currentUser = null;

/**
 * Represents the currently logged-in user. Stores all related state and information.
 */
export default class LocalUser {

	/**
	 * The currently logged-in LocalUser, if there is one. Will be generated lazily if the user exists in local storage.
	 * @return {LocalUser?}
	 */
	static get current() {

		// Check if not generated yet
		if (currentUser == null) {

			// Cancel if not all needed data exists in storage or the version is out-of-date
			const userData = {
				username: DataStore.get("username") || MISSING,
				userID: DataStore.get("userID") || MISSING,
				sessionID: DataStore.get("sessionID") || MISSING,
				courses: DataStore.get("courses") || MISSING,
				userInfo: DataStore.get("userInfo") || MISSING,
				version: DataStore.get("userVersion") || MISSING,
			};
			for (const key in userData) {
				if (userData[key] === MISSING) {
					return null;
				}
			}
			if (userData.version < VERSION) {
				return null;
			}

			// Passed checks, so assign user
			LocalUser.set(userData);

		}

		// Return current user
		return currentUser;

	};

	/**
	 * Creates and sets a new logged-in LocalUser using the provided user data, replacing any existing LocalUser. Not
	 * generally used externally (see {@link login}). Returns a Promise that will resolve if successful, as this method
	 * needs to pull user info.
	 * @param {{username, userID, sessionID, courses: {id, name, role}[]}} userData 
	 * @return {Promise<void>}
	 */
	static set(userData) {

		// Check if clearing
		if (userData == null) {

			// Remove from storage
			DataStore.clear("username");
			DataStore.clear("userID");
			DataStore.clear("sessionID");
			DataStore.clear("courses");
			DataStore.clear("userInfo");
			DataStore.clear("userVersion");

			// Clear current and return
			currentUser = null;
			return;

		}

		// Make a new LocalUser and assign basic properties
		const user = new LocalUser();
		user.username = userData.username;
		user.userID = userData.userID;
		user.sessionID = userData.sessionID;
		user.courses = userData.courses;
		user.userInfo = userData.userInfo; // (may be null)

		// Set current (need to do this first so session ID is known to requests)
		currentUser = user;

		// Define local storage record function
		const record = () => {
			DataStore.set("username", user.username);
			DataStore.set("userID", user.userID);
			DataStore.set("sessionID", user.sessionID);
			DataStore.set("courses", user.courses);
			DataStore.set("userInfo", user.userInfo);
			DataStore.set("userVersion", VERSION);
		}

		// Pull user info if not given
		if (user.userInfo == null) {
			return user.refreshUserInfo()
				.then(record)
				.catch((err) => {
					currentUser = null;
					throw err;
				});
		}

		// Record immediately and return resolved Promise
		record();
		return Promise.resolve();

	}

	/**
	 * Uses {@link UserAPI.login} to attempt a login with the given username and password, resolving to the result of
	 * the login (i.e. true = accepted, false = rejected). If successful, will update the currently logged-in LocalUser.
	 * If the request fails, then the Promise will reject with the error.
	 * @param {string} username 
	 * @param {string} password 
	 * @return {Promise<boolean>}
	 */
	static async login(username, password) {

		// Attempt login
		const result = await new UserAPI().login(username, password);

		// Set new user if successful and return result
		if (result.accepted) {
			return LocalUser.set({
				username: username,
				userID: result.userID,
				sessionID: result.sessionID,
				courses: result.courses
			}).then(() => {
				return true;
			}).catch((err) => {
				return false;
			});
		} else {
			return false;
		}

	}

	/**
	 * Uses {@link UserAPI.logout} to logout the currently logged-in LocalUser (if there is one). Will inform the server
	 * of the logout, but regardless of if the request is successful, this method will clear the currently logged-in
	 * LocalUser.
	 */
	static logout() {

		// Do nothing if no current user
		const current = LocalUser.current; // (will pull from storage if not done so already)
		if (current == null) {
			return;
		}

		// Attempt logout, ignoring result
		new UserAPI().logout(current.sessionID);

		// Clear user
		LocalUser.set(null);

	}

	/**
	 * React hook for various values of the currently logged-in LocalUser. Since this is static and independent of the
	 * {@link current} LocalUser object, this is valid even if no user is logged-in. Will error if the specified value
	 * doesn't exist.
	 * @param {"username"|"userID"|"sessionID"|"userInfo"|"courses"} value
	 * @return {any}
	 */
	static useValue(value) {

		// Hook and return proper value
		switch (value) {
			case "courses":
				return useDataStoreValue("courses") || [];
			case "username":
			case "userID":
			case "sessionID":
			case "userInfo":
				return useDataStoreValue(value);
			default:
				throw new Error(`Invalid LocalUser value "${value}"`);
		}

	}
	
	/**
	 * Local user's username.
	 * @type {string}
	 */
	username;
	
	/**
	 * Local user's user ID.
	 * @type {number}
	 */
	userID;
	
	/**
	 * Local user's current session ID.
	 * @type {string}
	 */
	sessionID;
	
	/**
	 * Local user's info, from {@link UserAPI.getUserData}.
	 * @type {{displayName: string, firstName: string, lastName: string, email: string, iconURL: string}}
	 */
	userInfo;

	/**
	 * Refreshes the {@link userInfo} property using up-to-date information from the backend.
	 * @return {Promise<void>}
	 */
	refreshUserInfo() {

		// Update user info value
		return new UserAPI().getUserData(this.userID)
			.then((data) => {
				this.userInfo = data;
				DataStore.set("userInfo", this.userInfo);
			})
			.catch((err) => {
				console.error("Failed to refresh local user's info:", err);
				throw err;
			});

	}

	/**
	 * Returns all courses that this user is a member of. Recommended over directly indexing `.courses`, since the
	 * format of that internal list is subject to change.
	 * @return {{id: number, name: string, role: string}[]}
	 */
	getCourses() {

		// Return internal list
		return this.courses;

	}

	/**
	 * Returns if the local user is in the given course.
	 * @param {number} courseID 
	 * @return {boolean}
	 */
	isInCourse(courseID) {

		// Check if in course list
		for (const course of this.courses) {
			if (course.id == courseID) {
				return true;
			}
		}
		return false;

	}

	/**
	 * Returns if the role of the user in the given course, returning null if the user is not in the course.
	 * @param {number} courseID 
	 * @return {"Professor"|"TA"|"Student"|null}
	 */
	getCourseRole(courseID) {

		// Return role in course list
		for (const course of this.courses) {
			if (course.id == courseID) {
				return course.role;
			}
		}
		return null;

	}

	/**
	 * Adds the given course to the local user's course list while signed in. Intended for whenever a user just newly
	 * registers.
	 * @param {{id: number, name: string, role: string}} course 
	 */
	addCourse(course) {

		// Validate input
		if (course.id == null) {
			throw new Error("Given course object is missing id");
		} else if (course.name == null) {
			throw new Error("Given course object is missing name");
		} else if (course.role == null) {
			throw new Error("Given course object is missing role");
		}
		for (const c of this.courses) {
			if (c.id == course.id) {
				throw new Error("Already in the given course");
			}
		}

		// Add to list and update store (will trigger an update for .useValue)
		this.courses = [...this.courses, course];
		DataStore.set("courses", this.courses);

	}

};