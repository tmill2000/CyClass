const { runQuery } = require("../../../utils/db_connection");

/**
 * @param {*} courseId
 * @param {*} title
 * @param {*} res
 * @returns lecture_id of created lecture
 */
const addLecture = async (courseId, title) => {
    try {
        const query = "INSERT INTO lectures (course_id, title, timestamp) VALUES (?, ?, NOW());";
        const resp = await runQuery(query, [courseId, title]);
        return resp.insertId;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 * Function to get a course
 * @param {*} lectureId
 * @param {*} res
 * @returns course data if successful
 */
const getLecture = async lectureId => {
    try {
        const query = "SELECT * from lectures WHERE lecture_id = ?;";
        const resp = await runQuery(query, [lectureId]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const getLecturesByCourseId = async courseId => {
    try {
        const query = `
        SELECT DISTINCT title, owner_id, netid, lecture_id, lectures.course_id, timestamp from 
            lectures 
        inner join courses on 
            courses.course_id = lectures.course_id 
        inner join users on 
            users.user_id = courses.owner_id 
        where 
            lectures.course_id = ?;`;
        const resp = await runQuery(query, [courseId]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

module.exports = {
    addLecture,
    getLecture,
    getLecturesByCourseId
};
