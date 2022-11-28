const addLecture = require('./addLecture');
const getLecture = require('./getLecture');

module.exports = {
    ...addLecture,
    ...getLecture
}