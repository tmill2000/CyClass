const { hasCoursePermissions } = require("../../utils/permissions");
const messageService = require("./services/messageService");
const { writeLog } = require("../../utils/logger");

const deleteMessage = async (req, res) => {
    try {
        const { message_id: messageId, course_id: courseId } = req.query;
        if (!messageId || !courseId) {
            return res.status(400).send({ msg: "Invalid Request" });
        }
        const [message] = await messageService.getMessage(messageId);
        if (!hasCoursePermissions(courseId, req.session) && message.sender_id !== req.session.userid) {
            return res.status(401).send({ msg: "Unauthorized" });
        }
        await messageService.deleteMessage(messageId);
        return res.status(204).send();
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = { deleteMessage };
