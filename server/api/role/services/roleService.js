const { runQuery } = require("../../../utils/db_connection");

/**
 * @typedef {Object} Role
 * @param {number} role_id
 * @param {number} course_id
 * @param {number} user_id
 * @param {"PROFESSOR" | "STUDENT" | "TA"} role
 */

/**
 * @param {number} courseId
 * @param {number} userId
 * @param {"PROFESSOR" | "STUDENT" | "TA"} role
 * @returns {Promise<number>}
 */
const addRole = async (courseId, userID, role) => {
    try {
        const query = "INSERT INTO roles (course_id, user_id, role) VALUES (?, ?, ?);";
        const resp = await runQuery(query, [courseId, userID, role]);
        return resp.insertId;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 * @param {number} roleId
 * @returns {Promise<Role[]>}
 */
const getRole = async roleId => {
    try {
        const query = "SELECT * from roles WHERE role_id = ?;";
        const resp = await runQuery(query, [roleId]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 * @param {number} userId
 * @returns {Promise<Role[]>}
 */
const getCourseRolesByUser = async userId => {
    try {
        const query = "SELECT * from roles WHERE user_id = ?;";
        const resp = await runQuery(query, [userId]);
        const roles = [];
        for (const role of resp) {
            const courseQuery = "SELECT * from courses WHERE course_id = ?;";
            const res = await runQuery(courseQuery, [role.course_id]);
            roles.push({
                role_id: role.role_id,
                course_id: role.course_id,
                course_name: res[0].course_name,
                role: role.role
            });
        }
        return roles;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

module.exports = {
    addRole,
    getCourseRolesByUser,
    getRole
};
