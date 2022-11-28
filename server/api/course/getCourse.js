const { runQuery } = require('../../utils/db_connection');


/**
 * Function to get a course
 * @param {*} req 
 *  req.query = {
 *    course_id: int
 *    session_id: string
 *  }
 * @param {*} res 
 * @returns course data if successful, otherwise a 500 or 400 error
 */
const getCourse = async (req, res) => {
    try {
        const {  course_id: courseId } = req.query;
        if (!courseId) {
            return res.status(400).send({ msg: "No course_id Provided" })
        }
        const query = 'SELECT * from courses WHERE course_id = ?;';
        const resp = await runQuery(query, [courseId]);
        return res.status(200).send({ 
            course_id: resp[0].course_id,
            owner_id: resp[0].owner_id,
            course_name: resp[0].course_name
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getCourse,
}