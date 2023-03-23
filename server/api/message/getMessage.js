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
        const resp = await messageService.getMessage(messageId);
        return res.status(200).send({
            message_id: resp[0].message_id,
            parent_id: resp[0].parent_id,
            sender_id: resp[0].sender_id,
            lecture_id: resp[0].lecture_id,
            timestamp: new Date(resp[0].timestamp).toISOString(),
            is_anonymous: resp[0].is_anonymous,
            body: resp[0].body
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getMessage
};
