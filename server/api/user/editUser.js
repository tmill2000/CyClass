const patch = require('../utils/patchService');

const editUser = async (req, res) => {
    try {
        const { netid: netid, password: password, first_name: firstName, last_name: lastName } = req.body;

        // call patch service


    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    editUser,
}