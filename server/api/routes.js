const express = require('express')

const health = require('./health/getHealthCheck');
const user = require('./user/userInfo')
const course = require('./course/router');
const validateSession = require('../middleware/validateSession');

const router = express.Router()

//Get Requests
router.get('/health', health.getHealthCheck);
router.get('/userInfo', validateSession, user.getUserInfoByUserId);
router.get('/logout', validateSession, user.logout);

//Post Requests
router.post('/login', user.login);
router.post('/course', validateSession, course.addCourse);

//Delete Requests

//Put Requests


module.exports = router;