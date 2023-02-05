const express = require('express');
const bodyParser = require('body-parser');

const health = require('./health/getHealthCheck');
const user = require('./user/router');
const course = require('./course/router');
const lecture = require('./lecture/router');
const message = require('./message/router');
const role = require('./role/router');
const poll = require('./poll/router');
const media = require('./media/router');

const validateSession = require('../middleware/validateSession');

const router = express.Router()

//Get Requests
router.get('/health', health.getHealthCheck);
router.get('/user', validateSession, user.getUserInfoByUserId);
router.get('/message/messagesByLecture', validateSession, message.getMessagesAndPollsByLectureId)
router.get('/course', validateSession, course.getCourse)
router.get('/message', validateSession, message.getMessage);
router.get('/lecture', validateSession, lecture.getLecture);
router.get('/lecture/live', validateSession, lecture.isLectureLive);
router.get('/poll-response', validateSession, poll.getPollResponse);
router.get('/role', validateSession, role.getRole)
router.get('/download-media', validateSession, media.downloadMedia)
router.get('/poll/metrics', validateSession, poll.getPollMetrics)
//Post Requests
router.post('/user/logout', validateSession, user.logout);
router.post('/user/login', user.login);
router.post('/course', validateSession, course.addCourse);
router.post('/lecture', validateSession, lecture.addLecture);
router.post('/user', validateSession, user.addUser);
router.post('/message', validateSession, message.addMessage);
router.post('/role', validateSession, role.addRole);
router.post('/poll-response', validateSession, poll.addPollResponse);
router.post('/upload-media', validateSession, bodyParser.raw({ type: ['image/jpeg', 'image/png'], limit: '5mb' }), media.uploadMedia); //TODO: Very vulnerable to malicious files
router.post('/poll', validateSession, poll.addPoll);

//Delete Requests

//Put Requests

//Patch
router.patch('/poll/close', validateSession, poll.closePoll)


module.exports = router;