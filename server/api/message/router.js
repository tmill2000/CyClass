const addMessage = require("./message");
const getMessagesAndPollsByLectureId = require("./getMessagesAndPollsByLectureId");
const getMessage = require("./getMessage");
const editMessage = require("./editMessage");

module.exports = {
    ...addMessage,
    ...getMessagesAndPollsByLectureId,
    ...getMessage,
    ...editMessage
};
