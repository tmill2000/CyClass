const mediaService = require('./services/mediaService');

const downloadMedia = async (req, res) => { //TODO: Add open-api spec
    try {
        const {
            media_id: mediaID,
            course_id: courseID
        } = req.query;

        const response = await mediaService.metadataForDownload(mediaID);
        const { file_type: fileType, user_in_course: userInCourse, received } = response[0];

        if (!received) {
            return res.status(404).send({ msg: 'Media not available' });
        }

        if(!userInCourse) {
            return res.status(403).send({ msg: 'Access to this media is forbidden' });
        }

        const dir = `../../sdmay23-40_media/${courseID}`;
        var options = {
            root: dir,
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
        };

        res.sendFile(`${mediaID}.${fileType}`, options, (err) => { // TODO: unhardcode file ext
            if (err) {
                console.log(err)
            } else {
                console.log('Sent:', `${mediaID}.jpeg`)
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }

}

module.exports = {
    downloadMedia,
}