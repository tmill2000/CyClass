const roleService = require('./services/roleService')

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
        const { courseId, userID, role } = req.body;
        if (!courseId || !userID || !['PROFESSOR', 'TA', 'STUDENT'].includes(role)) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const insertId = await roleService.addRole(courseId, userID, role)
        return res.status(201).send({ rollID: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addRole,
}