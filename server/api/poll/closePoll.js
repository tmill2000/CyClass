const pollService = require('./services/pollService')


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const closePoll = async (req, res) => {
    try {
        const {  poll_id: pollId } = req.query;
        if (!pollId) {
            return res.status(400).send({ msg: "No poll_id Provided" })
        }
        await pollService.closePoll(pollId)
        return res.status(204).send();
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    closePoll,
}