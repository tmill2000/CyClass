const pollService = require("./services/pollService");
const { isInCourse } = require("../../utils/permissions");

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
        const data = resp.length
            ? {
                  poll_id: resp[0].poll_id,
                  close_date: resp[0]?.close_date ? new Date(resp[0]?.close_date)?.toISOString() : null,
                  sender_id: resp[0].sender_id,
                  timestamp: new Date(resp[0].timestamp).toISOString(),
                  poll_type: resp[0].poll_type,
                  poll_choices: resp.map(choice => ({
                      poll_choice_id: choice.poll_choice_id,
                      question_text: choice.question_text,
                      choice_text: choice.choice_text,
                      is_correct_choice: !!choice.is_correct_choice
                  }))
              }
            : {};
        return res.status(200).send(data);
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getPollById
};
