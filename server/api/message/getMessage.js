const { writeLog } = require("../../utils/logger");
const messageService = require("./services/messageService");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getMessage = async (req, res) => {
    try {
        const { message_id: messageId } = req.query;
        if (!messageId) {
            return res.status(400).send({ msg: "No message_id Provided" });
        }
        const [resp] = await messageService.getMessage(messageId);
        return res.status(200).send({
            message_id: resp.message_id,
            parent_id: resp.parent_id,
            sender_id: resp.sender_id,
            lecture_id: resp.lecture_id,
            timestamp: new Date(resp.timestamp).toISOString(),
            is_anonymous: resp.is_anonymous,
            body: resp.body,
            media_id: resp.media_id,
            file_type: resp.file_type
        });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getMessage
};
