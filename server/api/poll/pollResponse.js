const { runQuery } = require('../../utils/db_connection');

/**
 * @param {*} req
 * req.body = {
 *  choiceId: int,
 *  userID: int,
 *  pollId: int,
 * }
 * @param {*} res 
 * @returns pollResponseID of created poll response
 */
const addPollResponse = async (req, res) => {
    try {
        const { choiceId, userID, pollId } = req.body;
        if (!choiceId || !userID || !pollId) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const query = 'INSERT INTO poll_responses (response_id, user_id, poll_id) VALUES (?, ?, ?);';
        const resp = await runQuery(query, [choiceId, userID, pollId]);
        return res.status(201).send({ pollResponseID: resp.insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addPollResponse,
}
