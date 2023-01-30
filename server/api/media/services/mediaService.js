const { runQuery } = require('../../../utils/db_connection');

/**
 * @param {*} mediaID
 * @returns course_id and user_id associated with given mediaID
 */
const authUpload = async (mediaID) => {
    try {
        const query = 'SELECT course_id, user_id, received FROM media_metadata WHERE media_id = ?';
        const resp = await runQuery(query, [mediaID]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

const markMediaReceived = async (mediaID) => {
    try {
        const query = 'UPDATE media_metadata SET received = true WHERE media_id = ?;';
        const resp = await runQuery(query, [mediaID]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    authUpload,
    markMediaReceived
}