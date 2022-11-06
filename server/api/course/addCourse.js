const { runQuery } = require('../../utils/db_connection');


/**
 * Function to add a course
 * @param {*} req 
 *  req.body = {
 *    owner_id: int,
 *    course_title: string
 *    session_id: int
 *  }
 * @param {*} res 
 * @returns course_id of the course if successful, otherwise a 500 error
 */
const addCourse = async (req, res) => {
    try {
        const { owner_id: ownerID, course_title: courseTitle } = req.body;
        if (!ownerID || !courseTitle) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const query = 'INSERT INTO courses (owner_id, course_name) VALUES (?, ?);';
        const resp = await runQuery(query, [ownerID, courseTitle]);
        return res.status(201).send({ course_id: resp.insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addCourse,
}