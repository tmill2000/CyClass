const express = require('express')

const health = require('./health/getHealthCheck');
const user = require('./user/userInfo')
const validateSession = require('../utils/validateSession');

const router = express.Router()

//Get Requests
router.get('/health', health.getHealthCheck);
router.get('/userInfo', validateSession, user.getUserInfoByUserId);
router.get('/logout', validateSession, user.logout)

//Post Requests
router.post('/login', user.login);

//Delete Requests

//Put Requests

//Web Sockets
router.ws('/echo', validateSession, (ws, _req) => {
    ws.on('message', (msg) => {
        ws.send(msg);
    })
})

module.exports = router;