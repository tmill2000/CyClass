const roleService = require('./services/roleService')
const courseService = require('../course/services/courseService')
const { hasCoursePermissions } = require('../../utils/permissions')

/**
 * @param {*} req 
 * req.body = {
 *  courseID: int,
 *  userID: int,
 *  role: enum('PROFESSOR', 'TA', 'STUDENT'),
 * }
 * @param {*} res 
 * @returns rollID of created roll
 */
const addRole = async (req, res) => {
    try {
        const { course_id: courseId, user_id: userId, role } = req.body;

        if (!courseId || !userId || !['PROFESSOR', 'TA', 'STUDENT'].includes(role)) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        if (!hasCoursePermissions(courseId, req.session)) {
            return res.status(401).send({ msg: 'Unauthorized: Cannot add role.' })
        }
        const insertId = await roleService.addRole(courseId, userId, role)
        return res.status(201).send({ rollID: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

const addRoleByJoinCode = async (req, res) => {
    try {
        const { join_code: joinCode } = req.params;
        if (!joinCode) {
            return res.status(400).send('Invalid Parameters')
        }
        const course = await courseService.getCourseByJoinCode(joinCode)
        const insertId = await roleService.addRole(course.course_id, req.session.userid, 'STUDENT')
        return res.status(201).send({ rollID: insertId })
    } catch (e) {
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    addRole,
    addRoleByJoinCode
}