const lectureService = require("./services/lectureService");
const { lectures } = require("../../websockets/websockets");
const { isInCourse } = require("../../utils/permissions");
const { writeLog } = require("../../utils/logger");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getLecture = async (req, res) => {
    try {
        const { lecture_id: lectureId, course_id: courseId } = req.query;
        if (!lectureId || !courseId) {
            return res.status(400).send({ msg: "Missing Parameters" });
        }
        if (!isInCourse(courseId, req.session)) {
            return res.status(401).send({ msg: "Must be associated with course to retrieve lecture info." });
        }
        const resp = await lectureService.getLecture(lectureId);
        return res.status(200).send({
            lecture_id: resp[0].lecture_id,
            course_id: resp[0].course_id,
            title: resp[0].title,
            timestamp: resp[0].timestamp
        });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const isLectureLive = async (req, res) => {
    const { lecture_id: lectureId, course_id: courseId } = req.query;
    if (!lectureId || !courseId) {
        return res.status(400).send("Missing Parameters");
    }
    if (!isInCourse(courseId, req.session)) {
        return res.status(401).send({ msg: "Must be associated with course to retrieve lecture info." });
    }
    return res.status(200).send({ lectureId, live: lectures.has(Number(lectureId)) });
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getLecturesByCourseId = async (req, res) => {
    try {
        const { course_id: courseId } = req.query;
        if (!courseId) {
            return res.status(400).send({ msg: "Missing Parameters" });
        }
        if (!isInCourse(courseId, req.session)) {
            return res.status(401).send({ msg: "Must be associated with course to retrieve lecture info." });
        }
        const resp = await lectureService.getLecturesByCourseId(courseId);
        return res.status(200).send(resp);
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    getLecture,
    isLectureLive,
    getLecturesByCourseId
};
