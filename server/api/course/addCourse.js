const courseService = require('./services/courseService')


/**
 * Function to add a course
 * @param {*} req 
 *  req.body = {
 *    ownerId: int,
 *    courseTitle: string
 *  }
 * @param {*} res 
 * @returns course_id of the course if successful, otherwise a 500 error
 */
const addCourse = async (req, res) => {
    try {
        const { ownerID, courseTitle } = req.body;
        if (!ownerID || !courseTitle) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const insertId = await courseService.addCourse(ownerID, courseTitle);;

        return res.status(201).send({ course_id: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addCourse,
}