const { runQuery } = require("../utils/db_connection");
const { writeLog } = require("../utils/logger");
const { isInCourse } = require("../utils/permissions");

const canEditGivenUser = async (req, res, next) => {
    const { user_id: userId } = req.body;

    if (process.env.NODE_ENV === "devl" || (userId && userId === req.session.userid)) {
        next();
        return;
    } else {
        return res.status(403).send({ msg: "Forbidden to update this record" });
    }
};

const canEditGivenMessage = async (req, res, next) => {
    if (process.env.NODE_ENV === "devl") {
        next();
        return;
    }

    const { message_id: messageId } = req.body;

    const courseQuery =
        "SELECT course_id FROM lectures WHERE lecture_id = (SELECT lecture_id FROM messages WHERE message_id = ?);";
    const rawQueryResp = await runQuery(courseQuery, [messageId]);

    const { course_id: courseId } = rawQueryResp[0];

    if (isInCourse(courseId, req.session)) {
        next();
        return;
    }

    return res.status(403).send({ msg: "Forbidden to update this record" });
};

const canEditGivenLecture = async (req, res, next) => {
    if (process.env.NODE_ENV === "devl") {
        next();
        return;
    }

    const lectureQuery =
        "SELECT role FROM roles WHERE course_id = (SELECT course_id FROM lectures WHERE lecture_id = ?) AND user_id = ?;";
};

module.exports = {
    canEditGivenUser,
    canEditGivenMessage,
    canEditGivenLecture
};
