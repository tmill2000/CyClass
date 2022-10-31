
const getUserInfoByUserId= require('./userInfo');
const login = require('./userInfo');
const logout= require('./userInfo');


module.exports = {
    ...getUserInfoByUserId,
    ...login,
    ...logout
}