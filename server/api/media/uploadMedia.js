const fs = require('fs');

const mediaService = require('./services/mediaService');

/**
 * @param {*} req 
 * req.body = {
 *    media_id: String
 * }
 * @param {*} res 
 * @returns guid of uploaded media
 */
const uploadMedia = async (req, res) => { //TODO: Add open-api spec
    try {
        const {
            media_id: mediaID,
        } = req.query;

        if (!mediaID) {
            return res.status(400).send({ msg: "Invalid Body" });
        }

        const response = await mediaService.authUpload(mediaID);
        const { course_id: courseID, user_id: userID } = response[0];

        if (userID !== req.session.userid) {
            return res.status(403).send({ msg: "Forbidden to upload file to this mediaID", usersUserID: userID, sessionID: req.session.userid, courseID });
        }

        const dir = `../../sdmay23-40_media/${courseID}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); 
        }

        fs.writeFile(`${dir}/${mediaID}.png`, req.body, (error) => { //not sure how handle file extension yet
            if (error) {
                throw error;
            }
        });

        return res.status(200).send({ guid: 'guid goes here' });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }

}

module.exports = {
    uploadMedia,
}