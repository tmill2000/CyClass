const courseService = require("./services/courseService");

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
        const resp = await courseService.getCourse(courseId);
        return res.status(200).send({
            course_id: resp[0].course_id,
            owner_id: resp[0].owner_id,
            course_name: resp[0].course_name,
            closed: !!resp[0].closed,
            join_code: resp[0].join_code
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getCourse
};
