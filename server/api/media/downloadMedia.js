const mediaService = require('./services/mediaService');

const downloadMedia = async (req, res) => { //TODO: Add open-api spec
    try {
        const {
            media_id: mediaID,
        } = req.query;

        // TODO: check if requester has access to course associated with media
        
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }

}

module.exports = {
    downloadMedia,
}