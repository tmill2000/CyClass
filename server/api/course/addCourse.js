const courseService = require("./services/courseService");
const { v4 } = require("uuid");
const { writeLog } = require("../../utils/logger");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const addCourse = async (req, res) => {
    try {
        const { ownerID, courseTitle } = req.body;
        if (!ownerID || !courseTitle) {
            return res.status(400).send({ msg: "Invalid Body" });
        }
        const joinCode = v4();
        const insertId = await courseService.addCourse(ownerID, courseTitle, joinCode);

        return res.status(201).send({ course_id: insertId, join_code: joinCode });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addCourse
};
