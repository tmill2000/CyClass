const express = require('express')

const health = require('./health/getHealthCheck');
const user = require('./user/router');
const course = require('./course/router');
const lecture = require('./lecture/router');
const message = require('./message/router');

const validateSession = require('../middleware/validateSession');

const router = express.Router()

//Get Requests
router.get('/health', health.getHealthCheck);
router.get('/user', validateSession, user.getUserInfoByUserId);
router.get('/message/messagesByLecture', validateSession, message.getMessagesAndPollsByLectureId)

//Post Requests
router.post('/user/logout', validateSession, user.logout);
router.post('/user/login', user.login);
router.post('/course', validateSession, course.addCourse);
router.post('/lecture', validateSession, lecture.addLecture);
router.post('/user', validateSession, user.addUser);
router.post('/message', validateSession, message.addMessage);

//Delete Requests

//Put Requests


module.exports = router;