const addCourse = require('./addCourse');
const getCourse = require('./getCourse');

module.exports = {
    ...addCourse,
    ...getCourse
}