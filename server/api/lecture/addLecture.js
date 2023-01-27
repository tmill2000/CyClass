const lectureService = require('./services/lectureService')

/**
 * @param {*} req 
 * req.body = {
 *    course_id: int,
 *    title: string
 *    session_id: int
 * }
 * @param {*} res 
 * @returns lecture_id of created lecture
 */
const addLecture = async (req, res) => {
    try {
        const { course_id: courseId, title } = req.body;
        if (!courseId || !title) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const insertId = await lectureService.addLecture(courseId, title);
        return res.status(201).send({ lecture_id: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addLecture,
}