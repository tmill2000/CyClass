const { writeLog } = require("../../utils/logger");
const patch = require("../utils/patchService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const editPollPrompt = async (req, res) => {
    try {
        const { poll_id: pollId } = req.body;

        await patch.genericPatch("polls", req.body, "poll_id", pollId);

        return res.status(200).send({ msg: "Success" });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    editPollPrompt
};
