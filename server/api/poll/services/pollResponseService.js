const { runQuery } = require("../../../utils/db_connection");

/**
 * @typedef {Object} PollResponse
 * @param {number} poll_response_id
 * @param {number} user_id
 * @param {number} response_id
 * @param {number} poll_id
 */

/**
 * @param {number} choiceId
 * @param {number} userID
 * @param {number} pollId
 * @returns {Promise<number>}
 */
const addPollResponse = async (choiceId, userID, pollId) => {
    try {
        const query1 = `SELECT poll_response_id from poll_responses WHERE
                        user_id = ? AND poll_id = ? LIMIT 1;`;
        const resp1 = await runQuery(query1, [userID, pollId]);
        if (resp1.length) {
            const updateQuery = `
                UPDATE poll_responses
                SET
                    response_id = ?
                WHERE
                    poll_response_id = ?
            `;
            await runQuery(updateQuery, [choiceId, resp1[0].poll_response_id]);
            return resp1[0].poll_response_id;
        }
        const query2 = `INSERT INTO poll_responses 
                            (response_id, user_id, poll_id, timestamp)
                       VALUES 
                            (?, ?, ?, NOW()) 
                        `;
        const resp2 = await runQuery(query2, [choiceId, userID, pollId]);
        return resp2.insertId;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

/**
 * Function to get a course
 * @param {number} pollResponseId
 * @returns {Promise<PollResponse>}
 */
const getPollResponse = async pollResponseId => {
    try {
        const query = "SELECT * from poll_responses WHERE poll_response_id = ?;";
        const resp = await runQuery(query, [pollResponseId]);
        return resp;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

module.exports = {
    addPollResponse,
    getPollResponse
};
