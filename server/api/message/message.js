const { v4 } = require('uuid');

const { runQuery } = require('../../utils/db_connection');

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
        const { sender_id: senderId, body, is_anonymous: isAnonymous, lecture_id: lectureId, course_id: courseId, parent_id: parentID, has_media: hasMedia = false } = req.body;

        console.log(senderId);
        console.log(body);
        console.log(isAnonymous);
        console.log(lectureId);

        if (!senderId || !body || !(typeof isAnonymous === "boolean") || !lectureId) {
            return res.status(400).send({ msg: "Invalid Body" })
        }

        const msgQueryResp = await runQuery(msgQuery, [
            senderId,
            lectureId,
            isAnonymous,
            body,
            parentID ?? null,
        ]);

        let mediaQueryResp;
        const mediaGUID = v4();
        if (hasMedia) {
            mediaQueryResp = await runQuery(mediaQuery, [
                mediaGUID,
                courseId,
                msgQueryResp.insertId
            ]);
        }

        return res.status(201).send({ message_id: msgQueryResp.insertId, media_id: mediaQueryResp.insertId });

    } catch (e){
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    addMessage,
}