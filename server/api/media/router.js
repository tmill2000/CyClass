const uploadMedia = require('./uploadMedia');
const downloadMedia = require('./downloadMedia');

module.exports = {
    ...uploadMedia,
    ...downloadMedia
}