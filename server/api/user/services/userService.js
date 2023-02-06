const { runQuery } = require('../../../utils/db_connection');

/**
 * Takes in a user id and returns that users email address
 * 
 * @param {*} userId
 * @returns object containing the user_id and email 
 */
const getUserInfoByUserId = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE user_id = ?';
        const rows = await runQuery(query, [userId]);
        return rows
    } catch (e) {
        console.error(e)
        throw e
    }
}
/**
 * 
 * @param {*} netId
 * @param {*} password
 * @returns user login info on server
 */
const loginInfo = async (netId, password) => {
    try {
        const query = 'SELECT * FROM users WHERE netid = ? AND password = ?';
        const rows = await runQuery(query, [netId, password]);
        return rows
    } catch (err) {
        console.error(err)
        throw err
    }
}

/**
 * Function to add a user
 * @param {*} netid
 * @param {*} password
 * @param {*} firstName
 * @param {*} lastName
 * @returns user_id of the user if successful, otherwise a 500 error
 */
 const addUser = async (netid, password, firstName, lastName) => {
    try {
        const query = 'INSERT INTO users (netid, password, first_name, last_name) VALUES (?, ?, ?, ?);';
        const response = await runQuery(query, [netid, password, firstName, lastName]);
        return response.insertId
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = { 
    getUserInfoByUserId,
    loginInfo, 
    addUser 
}