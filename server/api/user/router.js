
const getUserInfoByUserId= require('./userInfo');
const login = require('./userInfo');
const logout = require('./userInfo');
const addUser = require('./addUser');
const editUser = require('./editUser');


module.exports = {
    ...getUserInfoByUserId,
    ...login,
    ...logout,
    ...addUser,
    ...editUser
}