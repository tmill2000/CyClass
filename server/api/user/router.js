
const getUserInfoByUserId= require('./userInfo');
const login = require('./userInfo');
const logout = require('./userInfo');
const addUser = require('./addUser');


module.exports = {
    ...getUserInfoByUserId,
    ...login,
    ...logout,
    ...addUser
}