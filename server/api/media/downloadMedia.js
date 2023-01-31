const mediaService = require('./services/mediaService');

const downloadMedia = async (req, res) => { //TODO: Add open-api spec
    try {
        const {
            media_id: mediaID,
            course_id: courseID
        } = req.query;

        // TODO: check if requester has access to course associated with media

        // TODO: check for filetype from metadata

        const dir = `../../sdmay23-40_media/${courseID}`;
        var options = {
            root: dir,
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
        };

        res.sendFile(`${mediaID}.jpeg`, options, (err) => { // TODO: unhardcode file ext
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