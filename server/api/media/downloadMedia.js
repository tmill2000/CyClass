const { writeLog } = require("../../utils/logger");
const mediaService = require("./services/mediaService");

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const downloadMedia = async (req, res) => {
    //TODO: Add open-api spec
    try {
        const { media_id: mediaID, course_id: courseID } = req.query;

        if (!mediaID || !courseID) {
            return res.status(400).send({ msg: "Missing media_id or course_id query params" });
        }

        const [response] = await mediaService.metadataForDownload(req.session.userid, mediaID);
        const { file_type: fileType, user_in_course: userInCourse, received } = response;

        if (!received || !fileType) {
            return res.status(404).send({ msg: "Media not available" });
        }

        if (!userInCourse) {
            return res.status(403).send({ msg: "Access to this media is forbidden" });
        }

        const dir = `../../sdmay23-40_media/${courseID}`;
        var options = {
            root: dir,
            headers: {
                "x-timestamp": Date.now(),
                "x-sent": true
            }
        };

        res.sendFile(`${mediaID}.${fileType}`, options, err => {
            /* istanbul ignore next */
            if (err) {
                console.log(err);
            } else {
                console.log("Sent:", `${mediaID}.${fileType}`);
            }
        });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error", e });
    }
};

module.exports = {
    downloadMedia
};
