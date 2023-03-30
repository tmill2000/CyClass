const pollService = require("./services/pollService");
const { hasCoursePermissions } = require("../../utils/permissions");
const { writeLog } = require("../../utils/logger");
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const addPoll = async (req, res) => {
    try {
        const {
            lecture_id: lectureId,
            question_text: questionText,
            poll_choices: pollChoices,
            course_id: courseId,
            close_date: closeDate,
            poll_type: pollType
        } = req.body;
        const senderId = req.session.userid;
        if (!senderId || !lectureId || !questionText || !pollChoices || !courseId || !pollType) {
            return res.status(400).send({ msg: "Invalid Body" });
        }
        if (!hasCoursePermissions(courseId, req.session)) {
            return res.status(401).send({ msg: "Unauthorized: Cannot create poll" });
        }
        const resp = await pollService.addPoll(senderId, lectureId, questionText, pollChoices, pollType, closeDate);
        return res.status(201).send(resp);
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addPoll
};
