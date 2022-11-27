const addMessage = require('./message');
const getMessagesAndPollsByLectureId = require('./getMessagesAndPollsByLectureId');
const getMessage = require('./getMessage');

module.exports = {
    ...addMessage,
    ...getMessagesAndPollsByLectureId,
    ...getMessage
}