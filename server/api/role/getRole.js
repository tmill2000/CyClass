const { writeLog } = require("../../utils/logger");
const roleService = require("./services/roleService");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getRole = async (req, res) => {
    try {
        const { role_id: roleId } = req.query;
        if (!roleId) {
            return res.status(400).send({ msg: "No role_id Provided" });
        }
        const resp = await roleService.getRole(roleId);
        return res.status(200).send({
            role_id: resp[0].role_id,
            course_id: resp[0].course_id,
            user_id: resp[0].user_id,
            role: resp[0].role
        });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getRole
};
