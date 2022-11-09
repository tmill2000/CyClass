const { runQuery } = require('../../utils/db_connection');


/**
 * Function to add a user
 * @param {*} req 
 *  req.body = {
 *    netid: string,
 *    password: string
 *  }
 * @param {*} res 
 * @returns user_id of the user if successful, otherwise a 500 error
 */
const addUser = async (req, res) => {
    try {
        const { netid: netid, password: password } = req.body;
        if (!netid || !password) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const query = 'INSERT INTO users (netid, password) VALUES (?, ?);';
        const response = await runQuery(query, [netid, password]);
        return res.status(201).send({ user_id: response.insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addUser,
}