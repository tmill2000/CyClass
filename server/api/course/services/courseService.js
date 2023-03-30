const { runQuery } = require("../../../utils/db_connection");
const { writeLog } = require("../../../utils/logger");

const roleService = require("../../role/services/roleService");

/**
 * @typedef {Object} Course
 * @property {?string} course_id
 * @property {?number} closed
 * @property {?number} owner_id
 * @property {?number} join_code
 * @property {?number} course_name
 */

/**
 * @param {number} ownerID
 * @param {string} courseTitle
 * @param {string} joinCode
 * @returns {Promise<number>}
 */
const addCourse = async (ownerID, courseTitle, joinCode) => {
    try {
        const query = "INSERT INTO courses (owner_id, course_name, join_code, closed) VALUES (?, ?, ?, ?);";
        const resp = await runQuery(query, [ownerID, courseTitle, joinCode, false]);

        await roleService.addRole(resp.insertId, ownerID, "PROFESSOR");
        return resp.insertId;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 *
 * @param {number} courseId
 * @returns {Promise<Course[]>}
 */
const getCourse = async courseId => {
    try {
        const query = "SELECT * from courses WHERE course_id = ?;";
        const resp = await runQuery(query, [courseId]);
        return resp;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 *
 * @param {string} joinCode
 * @returns {Promise<Course>}
 */
const getCourseByJoinCode = async joinCode => {
    try {
        const query = "SELECT course_id, closed from courses WHERE join_code = ?;";
        const [resp] = await runQuery(query, [joinCode]);
        return resp;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 *
 * @param {number} courseId
 */
const closeCourse = async courseId => {
    try {
        const query = "UPDATE courses SET closed = ? where course_id = ?";
        await runQuery(query, [true, courseId]);
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

module.exports = {
    addCourse,
    getCourse,
    getCourseByJoinCode,
    closeCourse
};
