const { runQuery } = require('../../utils/db_connection');
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
        const query = 'SELECT * FROM users WHERE user_id = ?';
        const rows = await runQuery(query, [userId]);
        if (!rows?.length) {
            return res.status(200).send({ msg: 'No user found' });
        }
        const userData = rows[0];

        const resp = {
            userId: userData.user_id,
            email: `${userData.netid}@iastate.edu`
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
        const query = 'SELECT * FROM users WHERE netid = ? AND password = ?';
        const rows = await runQuery(query, [netId, password]);

        if (!rows) {
            return res.status(200).send('Incorrect Username or Password')
        }
        if (netId == rows[0]?.netid && password == rows[0]?.password) {
            session = req.session;
            session.userid = rows[0].netid;
            session.netId = netId;
            session.id = crypto.randomBytes(16).toString('base64');
            res.status(200).send({ userId: rows[0].user_id, sessionId: session.id });
        }
        else {
            res.send({ msg: 'Incorrect username or password' });
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