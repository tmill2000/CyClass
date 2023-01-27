const { runQuery } = require('../../../utils/db_connection');

/**
 * @param {*} choiceId
 * @param {*} userID
 * @param {*} pollId
 * @returns pollResponseID of created poll response
 */
const addPollResponse = async (choiceId, userID, pollId) => {
    try {
        const query = 'INSERT INTO poll_responses (response_id, user_id, poll_id, timestamp) VALUES (?, ?, ?, NOW());';
        const resp = await runQuery(query, [choiceId, userID, pollId]);
        return resp.insertId;
    } catch (e) {
        console.error(e);
        throw e
    }
}

/**
 * Function to get a course
 * @param {*} pollResponseId 
 * @returns poll_response data
 */
 const getPollResponse = async (pollResponseId) => {
    try {
        const query = 'SELECT * from poll_responses WHERE poll_response_id = ?;';
        const resp = await runQuery(query, [pollResponseId]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    addPollResponse,
    getPollResponse
}
