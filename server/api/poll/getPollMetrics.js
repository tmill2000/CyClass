const pollService = require('./services/pollService')


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getPollMetrics = async (req, res) => {
    try {
        const {  poll_id: pollId, course_id: courseId } = req.query;
        if (!pollId || !courseId) {
            return res.status(400).send({ msg: "No poll_id or course_id Provided" })
        }
        const course = req.session.user_roles.filter((role) => Number(role?.course_id) === Number(courseId))
        if(!course.length){
            return res.status(401).send({msg: 'User is not associated with course'})
        }
        const isFaculty = course[0].role === 'PROFESSOR' || course[0].role === 'TA'
        const resp = await pollService.getPollMetrics(pollId, isFaculty)
        if(!isFaculty){
            const userResp = resp.filter((response) => Number(response.user_id) === Number(req.session.userid))
            return res.status(200).send({
                totalRespondants: userResp.length,
                correctResponses: userResp?.[0]?.is_correct_choice ?? 0,
                userResponse: userResp.length ? {
                    user_id: userResp[0]?.user_id,
                    poll_choice_id: userResp[0]?.poll_choice_id,
                    is_correct_choice: !!userResp[0]?.is_correct_choice
                } : []
            })
        }
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