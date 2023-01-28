const fs = require('fs');

/**
 * @param {*} req 
 * req.body = {
 *    course_id: int,
 *    media_id: String
 * }
 * @param {*} res 
 * @returns guid of uploaded media
 */
const uploadMedia = async (req, res) => {
    const {
        course_id: courseID,
        media_id: mediaID,
    } = req.query;
    const dir = `../../sdmay23-40_media/${courseID}`;

    if (!courseID || !mediaID) {
        return res.status(400).send({ msg: "Invalid Body" });
    }

    // TODO: add guid check from metadata here

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); 
    }

    try {
        fs.writeFile(`${dir}/${mediaID}.png`, req.body, (error) => { //not sure how handle file extension yet
            if (error) {
                throw error;
            }
        });
    } catch (error) {
        res.sendStatus(500);
    }

    return res.status(200).send({ guid: 'guid goes here' });
}

module.exports = {
    uploadMedia,
}