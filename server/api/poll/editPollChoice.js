const { writeLog } = require("../../utils/logger");
const patch = require("../utils/patchService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const editPollChoice = async (req, res) => {
    try {
        const { poll_choice_id: pollChoiceId } = req.body;

        await patch.genericPatch("poll_choices", req.body, "poll_choice_id", pollChoiceId);

        return res.status(200).send({ msg: "Success" });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    editPollChoice
};
