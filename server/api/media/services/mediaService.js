const { runQuery } = require('../../../utils/db_connection');

/**
 * @param {string} mediaID
 * @returns course_id and user_id associated with given mediaID
 */
const authUpload = async (mediaID) => {
    try {
        const query = 'SELECT course_id, user_id, received FROM media_metadata WHERE media_id = ?';
        const resp = await runQuery(query, [mediaID]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

/**
 * 
 * @param {string} mediaID Guid of media file
 * @param {string} fileType File extension associated with saved file (i.e. 'png' or 'jpg')
 * @returns 
 */
const updateMediaMetadataOnReceived = async (mediaID, fileType) => {
    try {
        const query = 'UPDATE media_metadata SET received = true, file_type = ? WHERE media_id = ?;';
        const resp = await runQuery(query, [fileType, mediaID]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    authUpload,
    updateMediaMetadataOnReceived
}