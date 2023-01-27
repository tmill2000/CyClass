const messageService = require('./services/messageService')

const msgQuery = `INSERT INTO messages (
    sender_id, 
    lecture_id, 
    timestamp, 
    is_anonymous, 
    body,
    parent_id) VALUES
    (
        ?, ?, NOW(), ?, ?, ?
    );`;

const mediaQuery = `INSERT INTO media_metadata ( media_id, course_id, message_id, timestamp ) VALUES ( ?, ?, ?, NOW());`;

/**
 * 
 * @param {*} req 
 * req.body = {
 *    sender_id: int,
 *    body: string,
 *    lecture_id: int,
 *    course_id: int, (REQUIRED FOR MEDIA)
 *    is_anonymous: bool
 *    parent_id: <optional>int
 *    session_id: int
 *    has_media: bool
 * }
 * @param {*} res 
 * @returns message_id of created message
 */
const addMessage = async (req, res) => {
    try {
        const { sender_id: senderId, body, is_anonymous: isAnonymous, lecture_id: lectureId, parent_id: parentID } = req.body;
        if (!senderId || !body || !lectureId) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const insertId = await messageService.addMessage(
            senderId,
            body,
            !!isAnonymous,
            lectureId,
            parentID ?? null,
        );
        return res.status(201).send({ messageId: insertId })
    } catch (e){
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    addMessage,
}