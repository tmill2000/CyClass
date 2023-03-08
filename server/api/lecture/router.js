const addLecture = require("./addLecture");
const getLecture = require("./getLecture");
const editLecture = require("./editLecture");

module.exports = {
    ...addLecture,
    ...getLecture,
    ...editLecture
};
