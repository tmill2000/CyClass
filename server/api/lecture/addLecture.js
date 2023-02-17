const lectureService = require('./services/lectureService')
const { hasCoursePermissions } = require('../../utils/permissions')

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
        const { title, course_id: courseId } = req.body;
        if (!courseId || !title) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        if(!hasCoursePermissions(courseId, req.session)){
            return res.status(401).send({ msg: 'Unauthorized to create lecture' })
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