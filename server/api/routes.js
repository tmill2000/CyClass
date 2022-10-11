const express = require('express')

const health = require('./health/getHealthCheck');

const router = express.Router()

router.get('/health', health.getHealthCheck);

router.ws('/echo', (ws, _req) => {
    ws.on('message', (msg) => {
        ws.send(msg);
    })
})

module.exports = router;