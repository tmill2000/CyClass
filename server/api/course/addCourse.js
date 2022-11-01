const { runQuery } = require('../../utils/db_connection');

const addCourse = async (req, res) => {
    try {
        const { owner_id: ownerID, course_title: courseTitle } = req.body;
        const query = 'INSERT INTO courses (owner_id, course_name) VALUES (?, ?);';
        const resp = await runQuery(query, [ownerID, courseTitle]);
        return res.status(201).send({course_id: resp.insertId});
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addCourse,
}