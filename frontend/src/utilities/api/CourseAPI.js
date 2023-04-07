/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
 */

import axios from "axios";

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
	 * @return {Promise<{id: number, title: string, live: boolean}[]>}
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
							return {
								id: lecture.lecture_id,
								title: lecture.title,
								live: result.data.live
							};
						})
						.catch((err) => {
							console.error("Failed to get live status of lecture:", err);
							return {
								id: lecture.lecture_id,
								title: lecture.title,
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
	 * Attempts to add the current signed in user to the course they provide via join code. 
	 * @param {string} joinCode join code 
	 * @returns {Promise<{accepted: boolean, course?: {id: number, name: string, role: string}}>}
	 */
	addCourseByJoinCode(joinCode) {
		
		// Perform post
		// return axios.post("/api/role/join", {}, {
		// 	params: {
		// 		join_code: joinCode
		// 	}
		// })
		return axios.post("/api/role/join?join_code=" + joinCode)
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
				if (err.response?.status == 401) {
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