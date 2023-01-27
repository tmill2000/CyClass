const { v4 } = require('uuid');

const messageService = require('./services/messageService');

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
 *    has_media: bool
 * }
 * @param {*} res 
 * @returns messageId of created message & mediaId of where to post media to
 */
const addMessage = async (req, res) => {
    try {
        const { 
            sender_id: senderId,
            body,
            is_anonymous: isAnonymous = false,
            lecture_id: lectureId,
            parent_id: parentID,
            course_id: courseID,
            has_media: hasMedia = false,
        } = req.body;
        if (!senderId || !body || !lectureId || (hasMedia && !courseID)) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const msgInsertId = await messageService.addMessage(
            senderId,
            body,
            !!isAnonymous,
            lectureId,
            parentID ?? null,
        );

        let mediaInsertId;
        if (hasMedia) {
            mediaInsertId = await messageService.addMediaMetadata(v4(), courseID, msgInsertId);
        }

        return res.status(201).send({ messageId: msgInsertId, mediaId: mediaInsertId })
    } catch (e){
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    addMessage,
}