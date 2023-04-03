const { v4 } = require("uuid");

const messageService = require("./services/messageService");
const { isInCourse } = require("../../utils/permissions");
const { writeLog } = require("../../utils/logger");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const addMessage = async (req, res) => {
    //TODO: Update open-api spec
    try {
        const {
            body,
            is_anonymous: isAnonymous = false,
            lecture_id: lectureId,
            parent_id: parentID,
            course_id: courseId,
            has_media: hasMedia = false
        } = req.body;
        const senderId = req.session.userid;
        if (!body || !lectureId || !courseId || (hasMedia && !courseId)) {
            return res.status(400).send({ msg: "Invalid Body" });
        }
        if (!isInCourse(courseId, req.session)) {
            return res.status(401).send({ msg: "Not in Course: Unable to send message." });
        }
        const msgInsertId = await messageService.addMessage(senderId, body, !!isAnonymous, lectureId, parentID ?? null);

        let mediaInsertId;
        if (hasMedia) {
            mediaInsertId = await messageService.addMediaMetadata(v4(), courseId, senderId, msgInsertId);
        }

        return res.status(201).send({ messageId: msgInsertId, mediaId: mediaInsertId });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addMessage
};
