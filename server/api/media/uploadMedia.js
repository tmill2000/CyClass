const fs = require('fs');

const mediaService = require('./services/mediaService');

const { isInCourse } = require('../../utils/permissions')

/**
 * @param {*} req 
 * req.query = {
 *    media_id: String
 * }
 * req.headers = {
 *    Content-Type must be set to correct image MIME type
 * }
 * @param {*} res 
 * @returns guid of uploaded media
 */
const uploadMedia = async (req, res) => { //TODO: Add open-api spec
    try {
        const {
            media_id: mediaID,
            course_id: courseId
        } = req.query;

        if (!mediaID || !courseId) {
            return res.status(400).send({ msg: "Invalid Body" });
        }
        
        if(!isInCourse(courseId, req.session)){
            return res.status(401).send({ msg: 'Not In Course: Unauthorized to add media' })
        }

        const fileType = req.get('Content-Type')?.split('/')[1];

        if (!["png", "jpg", "jpeg"].includes(fileType)) {
            return res.status(400).send({ msg: "Missing valid Content-Type header" });
        }

        const response = await mediaService.authUpload(mediaID);
        const { course_id: courseID, user_id: userID, received } = response[0];

        if (userID !== req.session.userid || received) {
            return res.status(403).send({ msg: "Forbidden to upload file to this mediaID" });
        }

        const dir = `../../sdmay23-40_media/${courseID}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); 
        }

        fs.writeFile(`${dir}/${mediaID}.${fileType}`, req.body, (error) => {
            if (error) {
                throw error;
            }
        });

        await mediaService.updateMediaMetadataOnReceived(mediaID, fileType);

        return res.status(200).send({ msg: 'Image successfully saved' });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }

}

module.exports = {
    uploadMedia,
}