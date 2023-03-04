const addCourse = require("./addCourse");
const getCourse = require("./getCourse");
const closeCourse = require('./closeCourse')

module.exports = {
    ...addCourse,
    ...getCourse,
    ...closeCourse
};
