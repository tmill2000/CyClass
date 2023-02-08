const lectureService = require('./services/lectureService')
const { lectures } = require('../../websockets/websockets')
const { hasCoursePermissions } = require('../../utils/permissions')


/**
 * Function to get a course
 * @param {*} req 
 *  req.query = {
 *    lecture_id: int
 *    session_id: string
 *  }
 * @param {*} res 
 * @returns course data if successful, otherwise a 500 or 400 error
 */
const getLecture = async (req, res) => {
    try {
        const {  lecture_id: lectureId, course_id: courseId } = req.query;
        if (!lectureId || !courseId) {
            return res.status(400).send({ msg: "Missing Parameters" })
        }
        if(!hasCoursePermissions(courseId, req.session)){
            return res.status(401).send({ msg: 'Must be associated with course to retrieve lecture info.' })
        }
        const resp = await lectureService.getLecture(lectureId);
        return res.status(200).send({ 
            lecture_id: resp[0].lecture_id,
            course_id: resp[0].course_id,
            title: resp[0].title
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

const isLectureLive = async (req, res) => {
    try {
        const { lecture_id: lectureId, course_id: courseId } = req.query;
        if(!lectureId || !courseId){
            return res.status(400).send('Missing Parameters')
        }
        if(!hasCoursePermissions(courseId, req.session)){
            return res.status(401).send({ msg: 'Must be associated with course to retrieve lecture info.' })
        }
        return res.status(200).send({ lectureId, live: lectures.has(Number(lectureId)) })
    } catch (e) {
        res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    getLecture,
    isLectureLive
}