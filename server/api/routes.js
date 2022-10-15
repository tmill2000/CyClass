const express = require('express')

const health = require('./health/getHealthCheck');
const user = require('./user/userInfo')

const router = express.Router()

router.get('/health', health.getHealthCheck);
router.get('/userInfo', user.getUserInfoByUserId);
router.get('/logout', user.logout)

router.post('/login', user.login);

router.ws('/echo', (ws, _req) => {
    ws.on('message', (msg) => {
        ws.send(msg);
    })
})

module.exports = router;