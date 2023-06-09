const fs = require("fs");

const mediaService = require("./services/mediaService");

const { isInCourse } = require("../../utils/permissions");
const { writeLog } = require("../../utils/logger");

/**
 * @param {Express.Request} req
 * req.query = {
 *    media_id: String
 *    course_id: String
 *    file_name: String
 * }
 * req.headers = {
 *    Content-Type must be set to correct image MIME type
 * }
 * @param {Express.Response} res
 * @returns guid of uploaded media
 */
const uploadMedia = async (req, res) => {
    //TODO: Add open-api spec
    try {
        const { media_id: mediaID, course_id: courseId, file_name: fileName } = req.query;

        if (!mediaID || !courseId || !fileName) {
            return res.status(400).send({ msg: "Invalid Body" });
        }

        if (!isInCourse(courseId, req.session)) {
            return res.status(401).send({ msg: "Not In Course: Unauthorized to add media" });
        }
        const fileType = req.get("Content-Type")?.split("/")[1];
        if (!["png", "jpg", "jpeg", "pdf", "txt", "mp4"].includes(fileType)) {
            return res.status(400).send({ msg: "Missing valid Content-Type header" });
        }

        const [response] = await mediaService.authUpload(mediaID);
        const { course_id: courseID, user_id: userID, received: alreadyReceived } = response;

        if (userID !== req.session.userid || alreadyReceived) {
            return res.status(403).send({ msg: "Forbidden to upload file to this mediaID" });
        }

        const dir = `../../sdmay23-40_media/${courseID}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFile(`${dir}/${mediaID}.${fileType}`, req.body, error => {
            /* istanbul ignore next */
            if (error) {
                throw error;
            }
        });

        await mediaService.updateMediaMetadataOnReceived(mediaID, fileType, fileName);

        return res.status(200).send({ msg: "Image successfully saved" });
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    uploadMedia
};
