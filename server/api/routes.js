const express = require('express')

const health = require('./health/getHealthCheck');

const router = express.Router()

router.get('/health', health.getHealthCheck);

module.exports = router;