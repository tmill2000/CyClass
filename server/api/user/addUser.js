const { writeLog } = require("../../utils/logger");
const userService = require("./services/userService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const addUser = async (req, res) => {
    try {
        const { netid: netid, password: password, first_name: firstName, last_name: lastName } = req.body;
        if (!netid || !password) {
            return res.status(400).send({ msg: "Invalid Body" });
        }
        const insertId = await userService.addUser(netid, password, firstName, lastName);
        return res.status(201).send({ user_id: insertId });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addUser
};
