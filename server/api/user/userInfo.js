const roleService = require('../role/services/roleService');
const userService = require('./services/userService')
const crypto = require('crypto');

/**
 * Takes in a user id and returns that users email address
 * 
 * @param {*} req express request object
 * @param {*} res express response object
 * @returns object containing the user_id and email 
 */
const getUserInfoByUserId = async (req, res) => {
    try {
        const userId = req?.query?.id;
        if (!userId) {
            return res.status(400).send({ msg: 'Invalid Parameters' })
        }
        const rows = await userService.getUserInfoByUserId(userId)
        if (!rows?.length) {
            return res.status(200).send({ msg: 'No user found' });
        }
        const userData = rows[0];

        const resp = {
            userId: userData.user_id,
            email: `${userData.netid}@iastate.edu`,
            first_name: userData.first_name,
            last_name: userData.last_name
        }
        return res.status(200).send(resp);
    } catch (e) {
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}
/**
 * takes in a username and password and returns the resulting user_id and created session for
 * the given login credentials
 * 
 * @param {*} req express request object
 * @param {*} res express response object
 * @returns user_id and created session for future requests
 */
const login = async (req, res) => {
    try {
        const { netId, password } = req.body;
        if (!netId || !password) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const rows = await userService.loginInfo(netId, password)
        if (!rows) {
            return res.status(401).send({msg: 'Incorrect Username or Password'})
        }
        if (netId == rows[0]?.netid && password == rows[0]?.password) {
            session = req.session;
            session.userid = rows[0].user_id;
            session.netId = netId;
            session.sessionId = crypto.randomBytes(16).toString('base64');
            const roles = await roleService.getCourseRolesByUser(session.userid)
            session.user_roles = roles
            res.status(200).send({ userId: rows[0].user_id, sessionId: session.sessionId, userRoles: roles });
        }
        else {
            res.status(401).send({ msg: 'Incorrect Username or Password' });
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}
/**
 * 
 * @param {*} req express request object
 * @param {*} res express response object
 * @returns Log out message
 */
const logout = async (req, res) => {
    req.session.destroy();
    return res.status(200).send({ msg: 'Logged Out' })
}

module.exports = { getUserInfoByUserId, login, logout }