const { writeLog } = require("../../utils/logger");
const patch = require("../utils/patchService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const editUser = async (req, res) => {
    try {
        const { user_id: userId } = req.body;

        await patch.genericPatch("users", req.body, "user_id", userId);

        return res.status(200).send({ msg: "Success" });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    editUser
};
