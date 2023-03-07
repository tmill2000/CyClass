const { runQuery } = require("../../../utils/db_connection");

const roleService = require("../../role/services/roleService");

/**
 *
 * @param {*} ownerID
 * @param {*} courseTitle
 * @returns
 */
const addCourse = async (ownerID, courseTitle, joinCode) => {
    try {
        const query = "INSERT INTO courses (owner_id, course_name, join_code, closed) VALUES (?, ?, ?, ?);";
        const resp = await runQuery(query, [ownerID, courseTitle, joinCode, false]);

        await roleService.addRole(resp.insertId, ownerID, "PROFESSOR");
        return resp.insertId;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 *
 * @param {*} courseId
 * @returns
 */
const getCourse = async courseId => {
    try {
        const query = "SELECT * from courses WHERE course_id = ?;";
        const resp = await runQuery(query, [courseId]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 *
 * @param {*} joinCode
 * @returns
 */
const getCourseByJoinCode = async joinCode => {
    try {
        const query = "SELECT course_id, closed from courses WHERE join_code = ?;";
        const [resp] = await runQuery(query, [joinCode]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 *
 * @param {*} courseId
 */
const closeCourse = async courseId => {
    try {
        const query = "UPDATE course SET closed = ? where course_id = ?";
        await runQuery(query, [true, courseId]);
    } catch (e) {
        throw e;
    }
};

module.exports = {
    addCourse,
    getCourse,
    getCourseByJoinCode,
    closeCourse
};
