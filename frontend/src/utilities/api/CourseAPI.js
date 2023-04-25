/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	04/25/2023
 */

import axios from "axios";

import UserAPI from "./UserAPI";

/**
 * Interface for the API related to courses.
 */
class CourseAPI {

	/**
	 * Creates a new API for a course with the given ID.
	 * @param {number} id
	 */
	constructor(id) {
		this.id = id;
	}

	/**
	 * Returns a Promise that will resovle with all lectures under this course after the given timestamp, or the most
	 * recent if no timestamp is given.
	 * @return {Promise<{id: number, title: string, time: Date, live: boolean, host: {id: number, name: string, role: string}}[]>}
	 */
	getAllLectures() {

		// Perform fetch
		return axios.get("/api/lecture/lecturesByCourse", {
				params: {
					course_id: this.id
				}
			})
			.then((res) => {

				// Get live status for each lecture, defaulting to false if fails
				return Promise.allSettled(res.data.map(lecture => axios.get("/api/lecture/live", {
						params: {
							course_id: this.id,
							lecture_id: lecture.lecture_id
						}
					})
						.then((result) => {
							return new UserAPI().getUserData(lecture.owner_id, this.id)
								.then((ownerData) => {
									return {
										id: lecture.lecture_id,
										title: lecture.title,
										time: new Date(lecture.timestamp),
										host: {
											id: res.data.owner_id,
											name: ownerData.displayName,
											role: ownerData.role
										},
										live: result.data.live
									};
								});
						})
						.catch((err) => {
							console.error("Failed to get live status / host of lecture:", err);
							return {
								id: lecture.lecture_id,
								title: lecture.title,
								time: new Date(lecture.timestamp),
								host: {
									id: null,
									name: "ERROR",
									role: "Unknown"
								},
								live: false
							};
						})
				)).then((results) => results.map((result) => result.value));

			})
			.catch((err) => {
				console.error("Failed to fetch lectures for course:", err);
				throw err;
			});

	}

	/**
	 * Retrieves info about this course.
	 * @returns {Promise<{name: string, joinCode: string, ownerID: number}>}
	 */
	getCourseInfo() {

		// Perform GET
		return axios.get("/api/course", {
			params: {
				course_id: this.id
			}
		})
			.then((res) => {

				// Assemble and return final result
				return {
					name: res.data.course_name,
					joinCode: res.data.join_code,
					ownerID: res.data.owner_id
				};

			})
			.catch((err) => {
				console.error("Failed to get course info:", err);
				throw err;
			});

	}

	/**
	 * Retrieves info about the specified lecture.
	 * @param {number} lectureID 
	 * @returns {Promise<{title: string, time: Date, host: {id: number, name: string, role: string}}>}
	 */
	getLectureInfo(lectureID) {

		// Perform series of gets
		return axios.get("/api/lecture", {
			params: {
				lecture_id: lectureID,
				course_id: this.id
			}
		})
			.then((res1) => {
				return axios.get("/api/course", {
					params: {
						course_id: this.id
					}
				})
					.then((res2) => {
						return new UserAPI().getUserData(res2.data.owner_id, this.id)
							.then((res3) => {
								
								// Assemble and return final result
								return {
									title: res1.data.title,
									time: new Date(res1.data.timestamp),
									host: {
										id: res2.data.owner_id,
										name: res3.displayName,
										role: res3.role
									}
								};
		
							})
							.catch((err) => {
								console.error("Failed to get lecture host:", err);
								return {
									title: res1.data.title,
									time: new Date(res1.data.timestamp),
									host: {
										id: null,
										name: "ERROR",
										role: "Unknown"
									}
								};
							})
					})
			})
			.catch((err) => {
				console.error("Failed to get lecture info:", err);
				throw err;
			});

	}

	/**
	 * Attempts to create a new lecture, returning a Promise that resolves to the new lecture's ID if successful
	 * (rejects otherwise).
	 * @param {string} title 
	 * @returns {Promise<number>}
	 */
	newLecture(title) {

		// Perform post
		return axios.post("/api/lecture", {
			title: title,
			course_id: this.id
		})
			.then((res) => {

				// Return new lecture ID
				return res.data.lecture_id;

			})
			.catch((err) => {
				console.error("Failed to create new lecture for course:", err);
				throw err;
			});

	}

	/**
	 * Attempts to create a new course, returning a Promise that resolves to the new course's ID if successful (rejects
	 * otherwise).
	 * @param {string} title 
	 * @param {number} ownerID user ID
	 * @returns {Promise<number>}
	 */
	newCourse(title, ownerID) {

		// Perform post
		return axios.post("/api/course", {
			courseTitle: title,
			ownerID: ownerID
		})
			.then((res) => {

				// Return new course ID
				return res.data.course_id;

			})
			.catch((err) => {
				console.error("Failed to create new course:", err);
				throw err;
			});

	}

	/**
	 * Attempts to add the current signed in user to the course they provide via join code. 
	 * @param {string} joinCode join code 
	 * @returns {Promise<{accepted: boolean, course?: {id: number, name: string, role: string}}>}
	 */
	joinCourseByJoinCode(joinCode) {
		
		// Perform post
		return axios.post("/api/role/join", {}, {
			params: {
				join_code: joinCode
			}
		})
			.then((res) => {

				// Use role ID to get course information (frontend has no concept of a "role ID")
				return axios.get("/api/role", {
					params: {
						role_id: res.data.rollID
					}
				})
					.then((res) => {
						return axios.get("/api/course", {
							params: {
								course_id: res.data.course_id
							}
						})
							.then((courseRes) => {

								// Return full data
								return {
									accepted: true,
									course: {
										id: res.data.course_id,
										name: courseRes.data.course_name,
										role: res.data.role
									}
								};

							});
					});

			})
			.catch((err) => {

				// Return rejection if cannot connect to DB
				if (err.response?.status == 401 || err.response?.status == 404) {
					return {
						accepted: false,
						course: null
					};
				}

				// Otherwise, log and propogate
				console.error("Failed to perform course addition:", err);
				throw err;

			});

	}

};

export default CourseAPI;