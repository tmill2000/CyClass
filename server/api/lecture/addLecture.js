const { runQuery } = require('../../utils/db_connection');

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
        const query = 'INSERT INTO lectures (course_id, title) VALUES (?, ?);';
        const resp = await runQuery(query, [courseId, title]);
        return res.status(201).send({lecture_id: resp.insertId});
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addLecture,
}