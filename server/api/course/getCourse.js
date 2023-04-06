const { writeLog } = require("../../utils/logger");
const courseService = require("./services/courseService");
const { isInCourse } = require("../../utils/permissions");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getCourse = async (req, res) => {
    try {
        const { course_id: courseId } = req.query;
        if (!courseId) {
            return res.status(400).send({ msg: "No course_id Provided" });
        }
        if (!isInCourse(courseId, req.session)) {
            return res.status(401).send({ msg: "Unauthorized" });
        }
        const [resp] = await courseService.getCourse(courseId);
        return res.status(200).send({
            course_id: resp.course_id,
            owner_id: resp.owner_id,
            course_name: resp.course_name,
            closed: !!resp.closed,
            join_code: resp.join_code
        });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getCourse
};
