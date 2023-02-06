const userService = require('./services/userService')

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
        const { netid: netid, password: password, first_name: firstName, last_name: lastName } = req.body;
        if (!netid || !password) {
            return res.status(400).send({ msg: "Invalid Body" })
        }
        const insertId = await userService.addUser(netid, password, firstName, lastName)
        return res.status(201).send({ user_id: insertId });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    addUser,
}