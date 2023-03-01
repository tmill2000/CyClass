const canEditGivenUser = async (req, res, next) => {
    if (process.env.NODE_ENV === "devl") next();

    try {
        const { user_id: userId } = req.body;

        if (process.env.NODE_ENV === "devl") {
            next();
        } else if (!userId || userId !== req.session.userid) {
            return res.status(403).send({ msg: "Forbidden to update this record" });
        } else {
            next();
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: "Internal Server Error on Patch Perm Validate" });
    }
};

module.exports = {
    canEditGivenUser
};
