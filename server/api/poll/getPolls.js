const pollService = require("./services/pollService");
const { isInCourse, hasCoursePermissions } = require("../../utils/permissions");
const { writeLog } = require("../../utils/logger");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getPollById = async (req, res) => {
    try {
        const { poll_id: pollId, course_id: courseId } = req.query;

        if (!pollId || !courseId) {
            return res.status(400).send({ msg: "Missing Parameters" });
        }
        if (!isInCourse(courseId, req.session)) {
            return res.status(401).send({ msg: "Unauthorized" });
        }
        const resp = await pollService.getPollById(pollId);
        const isClosed = resp.length > 0 && resp[0]?.close_date != null && new Date(resp[0]?.close_date).getTime() - Date.now() <= 0;
        const data = resp.length
            ? {
                  poll_id: resp[0].poll_id,
                  close_date: resp[0]?.close_date ? new Date(resp[0]?.close_date)?.toISOString() : null,
                  sender_id: resp[0].sender_id,
                  timestamp: new Date(resp[0].timestamp).toISOString(),
                  question_text: resp[0].question_text,
                  poll_type: resp[0].poll_type,
                  poll_choices: resp.map(choice => ({
                      poll_choice_id: choice.poll_choice_id,
                      choice_text: choice.choice_text,
                      is_correct_choice: (hasCoursePermissions(courseId, req.session) || isClosed) ? !!choice.is_correct_choice : null
                  }))
              }
            : {};
        return res.status(200).send(data);
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getPollById
};
