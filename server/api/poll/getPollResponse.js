const pollResponseService = require('./services/pollResponseService')


/**
 * Function to get a course
 * @param {*} req 
 *  req.query = {
 *    poll_response_id: int
 *    session_id: string
 *  }
 * @param {*} res 
 * @returns poll_response data if successful, otherwise a 500 or 400 error
 */
const getPollResponse = async (req, res) => {
    try {
        const {  poll_response_id: pollResponseId } = req.query;
        if (!pollResponseId) {
            return res.status(400).send({ msg: "No poll_response_id Provided" })
        }
        const resp = await pollResponseService.getPollResponse(pollResponseId)
        return res.status(200).send({ 
            poll_response_id: resp[0].poll_response_id,
            user_id: resp[0].user_id,
            response_id: resp[0].response_id,
            poll_id: resp[0].poll_id,
            timestamp: new Date(resp[0].timestamp).toISOString(),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getPollResponse,
}