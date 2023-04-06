const { runQuery } = require("../../../utils/db_connection");
const { writeLog } = require("../../../utils/logger");

/**
 * @typedef {Object} User
 * @param {number} user_id
 * @param {string} netid
 * @param {string} first_name
 * @param {string} last_name
 * @param {string} password
 */

/**
 * @param {number} userId
 * @returns {Promise<User[]>}
 */
const getUserInfoByUserId = async userId => {
    try {
        const query = "SELECT * FROM users WHERE user_id = ?";
        const rows = await runQuery(query, [userId]);
        return rows;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 * @param {number} userId
 * @returns {Promise<User[]>}
 */
const loginInfo = async netId => {
    try {
        const query = "SELECT * FROM users WHERE netid = ?";
        const rows = await runQuery(query, [netId]);
        return rows;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 * @param {number} netid
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise<number>}
 */
const addUser = async (netid, password, firstName, lastName) => {
    try {
        const noDupe = "SELECT user_id FROM users WHERE netid = ?";
        const [noDupeRes] = await runQuery(noDupe, [netid]);
        if (noDupeRes) return -1;
        const query = "INSERT INTO users (netid, password, first_name, last_name) VALUES (?, ?, ?, ?);";
        const response = await runQuery(query, [netid, password, firstName, lastName]);
        return response.insertId;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

module.exports = {
    getUserInfoByUserId,
    loginInfo,
    addUser
};
