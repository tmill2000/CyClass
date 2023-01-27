const { runQuery } = require('../../utils/db_connection');
const pollResponseService = require('./services/pollResponseService')

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
        const insertId = await pollResponseService.addPollResponse(choiceId, userID, pollId)
        return res.status(201).send({ pollResponseID: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addPollResponse,
}
