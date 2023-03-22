const addMessage = require("./message");
const getMessagesAndPollsByLectureId = require("./getMessagesAndPollsByLectureId");
const getMessage = require("./getMessage");
const editMessage = require("./editMessage");
const deleteMessage = require("./deleteMessage");

module.exports = {
    ...addMessage,
    ...getMessagesAndPollsByLectureId,
    ...getMessage,
    ...editMessage,
    ...deleteMessage
};
