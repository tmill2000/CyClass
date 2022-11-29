const addRole = require('./addRole');
const getRole = require('./getRole');

module.exports = {
    ...addRole,
    ...getRole
}