const addPollResponse = require('./pollResponse');
const getPollResponse = require('./getPollResponse');
const addPoll = require('./addPoll');

module.exports = {
    ...addPollResponse,
    ...getPollResponse,
    ...addPoll
}