const { runQuery } = require('../../utils/db_connection');

/**
 * 
 * @param {*} req 
 * req.body = {
 *    sender_id: int,
 *    body: string,
 *    lecture_id: int
 *    is_anonymous: bool
 *    parent_id: <optional>int
 *    session_id: int
 * }
 * @param {*} res 
 * @returns message_id of created message
 */
const addMessage = async (req, res) => {
    try {
        const { sender_id: senderId, body, is_anonymous: isAnonymous, lecture_id: lectureId, parent_id: parentID } = req.body;
        if (!senderId || !body || !isAnonymous || !lectureId) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const query = `INSERT INTO messages (
            sender_id, 
            lecture_id, 
            timestamp, 
            is_anonymous, 
            body,
            parent_id) VALUES
            (
                ?, ?, NOW(), ?, ?, ?
            );`
        const resp = await runQuery(query, [
            senderId,
            lectureId,
            isAnonymous,
            body,
            parentID ?? null,
        ]);
        return res.status(201).send({ message_id: resp.insertId })
    } catch (e){
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    addMessage,
}