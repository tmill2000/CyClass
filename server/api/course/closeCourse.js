const courseService = require("./services/courseService");
const { hasCoursePermissions } = require("../../utils/permissions");
const { writeLog } = require("../../utils/logger");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const closeCourse = async (req, res) => {
    try {
        const { course_id: courseId } = req.query;
        if (!courseId) {
            return res.status(400).send({ msg: "Invalid Parameters" });
        }
        if (!hasCoursePermissions(courseId, req.session)) {
            return res.status(401).send({ msg: "Unauthorized" });
        }
        await courseService.closeCourse(courseId);
        res.status(204).send();
    } catch (e) {
        writeLog("error", e);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    closeCourse
};
