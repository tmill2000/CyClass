const pollService = require('./services/pollService')
const { hasCoursePermissions } = require('../../utils/permissions')

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const closePoll = async (req, res) => {
    try {
        const {  poll_id: pollId, course_id: courseId } = req.query;

        if (!pollId || !courseId) {
            return res.status(400).send({ msg: "No poll_id Provided" })
        }
        if(!hasCoursePermissions(courseId, req.session)){
            return res.status(401).send({ msg: 'Unauthorized: Cannot close poll' })
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