const addMessage = require('./message');
const getMessagesAndPollsByLectureId = require('./getMessagesAndPollsByLectureId');

module.exports = {
    ...addMessage,
    ...getMessagesAndPollsByLectureId
}