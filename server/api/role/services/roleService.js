const { runQuery } = require('../../../utils/db_connection');

/**
 * 
 * @param {*} courseId 
 * @param {*} userId 
 * @param {*} role 
 * @returns id of inserted item
 */
const addRole = async (courseId, userID, role) => {
    try {
        const query = 'INSERT INTO roles (course_id, user_id, role) VALUES (?, ?, ?);';
        const resp = await runQuery(query, [courseId, userID, role]);
        return resp.insertId
    } catch (e) {
        console.error(e);
        throw e
    }
}

/**
 * Function to get a course
 * @param {*} roleId
 * @param {*} res 
 * @returns role data if successful, otherwise a 500 or 400 error
 */
 const getRole = async (roleId) => {
    try {
        const query = 'SELECT * from roles WHERE role_id = ?;';
        const resp = await runQuery(query, [roleId]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e
    }
}


/**
 * Function to get a users roles in their courses
 * @param {*} userid
 * @param {*} res 
 * @returns role data if successful, otherwise a 500 or 400 error
 */
 const getCourseRolesByUser = async (userId) => {
    try {
        const query = 'SELECT * from roles WHERE user_id = ?;';
        const resp = await runQuery(query, [userId]);
        const roles = []
        for (const role of resp){
            const courseQuery = "SELECT * from courses WHERE course_id = ?;"
            const res = await runQuery(courseQuery, [role.course_id]);
            roles.push({
                role_id: role.role_id,
                course_id: role.course_id,
                course_name: res[0].course_name,
                role: role.role
            })
        }
        return roles
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    addRole,
    getCourseRolesByUser,
    addRole,
    getRole
}