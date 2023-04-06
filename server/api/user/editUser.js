const { writeLog } = require("../../utils/logger");

const patch = require("../utils/patchService");
const bcrypt = require("bcrypt");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const editUser = async (req, res) => {
    try {
        const { user_id: userId, password } = req.body;
        if (password) {
            const hash = bcrypt.hashSync(password, 10);
            req.body.password = hash;
        }
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
