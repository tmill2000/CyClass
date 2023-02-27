const patch = require('../utils/patchService');

const editUser = async (req, res) => {
    try {
        const { user_id: userId } = req.body;

        const patchRes = await patch.genericPatch("users", req.body, "user_id", userId);

        return res.status(200).send({ patchRes });

    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    editUser,
}