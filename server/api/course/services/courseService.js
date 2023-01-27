const { runQuery } = require('../../../utils/db_connection');

const roleService = require('../../role/services/roleService');


/**
 * Function to add a course
 * @param {*} ownerID 
 * @param {*} courseTitle 
 * @returns course_id of the course if successful, otherwise a 500 error
 */
const addCourse = async (ownerID, courseTitle) => {
    try {
        const query = 'INSERT INTO courses (owner_id, course_name) VALUES (?, ?);';
        const resp = await runQuery(query, [ownerID, courseTitle]);

        await roleService.addRole(resp.insertId, ownerID, 'PROFESSOR');

        return resp.insertId
    } catch (e) {
        console.error(e);
        throw e
    }
}

/**
 * Function to get a course
 * @param {*} req 
 *  req.query = {
 *    course_id: int
 *    session_id: string
 *  }
 * @param {*} res 
 * @returns course data if successful, otherwise a 500 or 400 error
 */
 const getCourse = async (courseId) => {
    try {
        const query = 'SELECT * from courses WHERE course_id = ?;';
        const resp = await runQuery(query, [courseId]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    addCourse,
    getCourse
}