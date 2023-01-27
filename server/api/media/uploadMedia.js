const fs = require('fs');

/**
 * @param {*} req 
 * req.body = {
 *    course_id: int,
 *    message_id: int,
 *    media_id: String
 * }
 * @param {*} res 
 * @returns guid of uploaded media
 */
const uploadMedia = async (req, res) => {
    console.log("img", req.body);

    const {
        course_id: courseID,
        message_id: messageID,
        media_id: mediaID,
    } = req.body;
    const dir = `../../../../sdmay23-40_media/${courseID}`;

    // TODO: add guid check from metadata here

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); 
    }

    try {
        fs.writeFile(`${mediaID}.jpeg`, req.body, (error) => { //not sure how handle file extension yet
          if (error) {
            throw error;
          }
        });
  
        res.sendStatus(200);
      } catch (error) {
        res.sendStatus(500);
      }

    return res.status(200).send({ guid: 'guid goes here' });
}

module.exports = {
    uploadMedia,
}