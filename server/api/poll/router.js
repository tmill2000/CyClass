const addPollResponse = require('./pollResponse');
const getPollResponse = require('./getPollResponse');
const addPoll = require('./addPoll');
const getPollMetrics = require('./getPollMetrics')
const closePoll = require('./closePoll')

module.exports = {
    ...addPollResponse,
    ...getPollResponse,
    ...addPoll,
    ...getPollMetrics,
    ...closePoll
}