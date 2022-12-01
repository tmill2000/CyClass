const { runQuery } = require('../../utils/db_connection');


/**
 * Function to get a course
 * @param {*} req 
 *  req.query = {
 *    message_id: int
 *    session_id: string
 *  }
 * @param {*} res 
 * @returns course data if successful, otherwise a 500 or 400 error
 */
const getMessage = async (req, res) => {
    try {
        const {  lecture_id: lectureId } = req.query;
        if (!courseId) {
            return res.status(400).send({ msg: "No message_id Provided" })
        }
        const query = 'SELECT * from messages WHERE message_id = ?;';
        const resp = await runQuery(query, [lectureId]);
        return res.status(200).send({ 
            message_id: resp[0].message_id,
            parent_id: resp[0].parent_id,
            sender_id: resp[0].sender_id,
            lecture_id: resp[0].lecture_id,
            timestamp: new Date(new Date(value[0].timestamp).toUTCString()).getTime(),
            is_anonymous: resp[0].is_anonymous,
            body: resp[0].body
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getMessage,
}