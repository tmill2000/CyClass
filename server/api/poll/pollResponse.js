const pollResponseService = require('./services/pollResponseService')
const { isInCourse } = require('../../utils/permissions')

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
        const { choice_id: choiceId, poll_id: pollId, course_id: courseId } = req.body;
        const userId = req.session.userid;
        if (!choiceId || !userId || !pollId || !courseId) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        if(!isInCourse(courseId, req.session)){
            return res.status(401).send({ msg: 'Not in course: unable to respond to poll.'})
        }
        const insertId = await pollResponseService.addPollResponse(choiceId, userId, pollId)
        return res.status(201).send({ pollResponseID: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addPollResponse,
}
