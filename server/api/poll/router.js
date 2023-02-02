const addPollResponse = require('./pollResponse');
const getPollResponse = require('./getPollResponse');
const addPoll = require('./poll');


module.exports = {
    ...addPollResponse,
    ...getPollResponse,
    ...addPoll
}