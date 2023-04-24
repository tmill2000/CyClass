const { writeLog } = require("../../utils/logger");
const userService = require("./services/userService");
const bcrypt = require("bcrypt");

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
        if (netid.includes("@iastate.edu") || netid.length < 3 || netid.length > 8) {
            return res.status(400).send({
                msg: "Invalid username: netid must not include @iastate.edu and must be between 3 and 8 characters"
            });
        }
        const hash = bcrypt.hashSync(password, 10);
        const insertId = await userService.addUser(netid, hash, firstName, lastName);
        if (insertId < 0) {
            return res.status(409).send({ msg: `NetId ${netid} is taken.` });
        }
        return res.status(201).send({ user_id: insertId });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addUser
};
