const pollService = require('./services/pollService')
const { hasCoursePermissions } = require('../../utils/permissions')
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const addPoll = async (req, res) => {
    try {
        const { lecture_id: lectureId, question_text: questionText, poll_choices: pollChoices, course_id: courseId } = req.body
        const senderId = req.session.userid;
        if (!senderId || !lectureId || !questionText || !pollChoices || !courseId) {
            return res.status(400).send({ msg: 'Invalid Body' })
        }
        if(!hasCoursePermissions(courseId, req.session)){
            return res.status(401).send({ msg: 'Unauthorized: Cannot create poll' })
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