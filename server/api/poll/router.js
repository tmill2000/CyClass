const addPollResponse = require('./pollResponse');
const getPollResponse = require('./getPollResponse');

module.exports = {
    ...addPollResponse,
    ...getPollResponse
}