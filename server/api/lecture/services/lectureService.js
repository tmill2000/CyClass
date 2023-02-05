const { runQuery } = require('../../../utils/db_connection');

/**
 * @param {*} courseId 
 * @param {*} title 
 * @param {*} res 
 * @returns lecture_id of created lecture
 */
const addLecture = async (courseId, title) => {
    try {
        const query = 'INSERT INTO lectures (course_id, title) VALUES (?, ?);';
        const resp = await runQuery(query, [courseId, title]);
        return resp.insertId
    } catch (e) {
        console.error(e);
        throw e
    }
}

/**
 * Function to get a course
 * @param {*} lectureId 
 * @param {*} res 
 * @returns course data if successful
 */
 const getLecture = async (lectureId) => {
    try {
        const query = 'SELECT * from lectures WHERE lecture_id = ?;';
        const resp = await runQuery(query, [lectureId]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    addLecture,
    getLecture
}