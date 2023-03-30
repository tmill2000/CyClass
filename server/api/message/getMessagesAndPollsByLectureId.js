const { writeLog } = require("../../utils/logger");
const messageService = require("./services/messageService");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getMessagesAndPollsByLectureId = async (req, res) => {
    try {
        const { lecture_id: lectureId, timestamp } = req.query;
        if (!lectureId) {
            return res.status(400).send("Missing Parameters");
        }
        const resp = await messageService.getMessagesAndPollsByLectureId(lectureId, timestamp);
        return res.status(200).send(resp);
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getMessagesAndPollsByLectureId
};
