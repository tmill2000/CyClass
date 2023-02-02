const pollService = require('./services/pollService')


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getPollMetrics = async (req, res) => {
    try {
        const {  poll_id: pollId } = req.query;
        if (!pollId) {
            return res.status(400).send({ msg: "No poll_id Provided" })
        }
        const resp = await pollService.getPollMetrics(pollId)
        const numCorrect = resp.filter((response) => response.is_correct_choice).length
        return res.status(200).send({ 
            totalRespondants: resp.length,
            correctResponses: numCorrect,
            userResponses: resp.map((response) => ({
                user_id: response.user_id,
                poll_choice_id: response.poll_choice_id,
                is_correct_choice: !!response.is_correct_choice,
            }))
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getPollMetrics,
}