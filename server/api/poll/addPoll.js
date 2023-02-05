const pollService = require('./services/pollService')
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const addPoll = async (req, res) => {
    try {
        const { sender_id: senderId, lecture_id: lectureId, question_text: questionText, poll_choices: pollChoices } = req.body
        if (!senderId || !lectureId || !questionText || !pollChoices) {
            return res.status(400).send({ msg: 'Invalid Body' })
        }
        const resp = await pollService.addPoll(senderId, lectureId, questionText, pollChoices);
        return res.status(201).send(resp);
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }

}


module.exports = {
    addPoll
}