const { writeLog } = require("../../utils/logger");
const patch = require("../utils/patchService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const editMessage = async (req, res) => {
    try {
        const { message_id: messageId } = req.body;

        await patch.genericPatch("messages", req.body, "message_id", messageId);

        return res.status(200).send({ msg: "Success" });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    editMessage
};
