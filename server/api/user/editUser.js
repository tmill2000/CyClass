const patch = require('../utils/patchService');

const editUser = async (req, res) => {
    try {
        const { user_id: userId } = req.body;

        return res.status(200).send("in edit");

        await patch.genericPatch("users", req.body, "user_id", userId);

        return res.status(200).send({ msg: `Updated user: ${userId}`});

    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    editUser,
}