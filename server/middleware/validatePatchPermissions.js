const { runQuery } = require("../utils/db_connection");
const { isInCourse } = require("../utils/permissions");

const canEditGivenUser = async (req, res, next) => {
    if (process.env.NODE_ENV === "devl") next();

    try {
        const { user_id: userId } = req.body;

        if (process.env.NODE_ENV === "devl") {
            next();
        } else if (!userId || userId !== req.session.userid) {
            return res.status(403).send({ msg: "Forbidden to update this record" });
        } else {
            next();
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: "Internal Server Error on Patch Perm Validate" });
    }
};

const canEditGivenMessage = async (req, res, next) => {
    if (process.env.NODE_ENV === "devl") next();

    const { message_id: messageId } = req.body;

    const courseQuery =
        "SELECT course_id FROM lectures WHERE lecture_id = (SELECT lecture_id FROM messages WHERE message_id = ?);";
    const rawQueryResp = await runQuery(courseQuery, [messageId]);
    const { course_id: courseId } = rawQueryResp[0];

    if (isInCourse(courseId, req.session)) next();

    return res.status(403).send({ msg: "Forbidden to update this record" });
};

module.exports = {
    canEditGivenUser,
    canEditGivenMessage
};
