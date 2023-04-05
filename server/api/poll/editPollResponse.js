const { writeLog } = require("../../utils/logger");
const patch = require("../utils/patchService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const editPollResponse = async (req, res) => {
    try {
        const { poll_response_id: pollResponseId } = req.body;

        await patch.genericPatch("poll_responses", req.body, "poll_response_id", pollResponseId);

        return res.status(200).send({ msg: "Success" });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    editPollResponse
};
