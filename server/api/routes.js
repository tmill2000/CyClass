const express = require('express')

const health = require('./health/getHealthCheck');
const user = require('./user/userInfo');
const course = require('./course/router');
const lecture = require('./lecture/router');
const createUser = require('./createUser/router');
const validateSession = require('../middleware/validateSession');

const router = express.Router()

//Get Requests
router.get('/health', health.getHealthCheck);
router.get('/userInfo', validateSession, user.getUserInfoByUserId);
router.get('/logout', validateSession, user.logout);

//Post Requests
router.post('/login', user.login);
router.post('/course', validateSession, course.addCourse);
router.post('/lecture', validateSession, lecture.addLecture);
router.post('/createUser', validateSession, createUser.addUser);

//Delete Requests

//Put Requests


module.exports = router;