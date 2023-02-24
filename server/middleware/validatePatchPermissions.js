const canEditGivenUser = async (req, res) => {
    try {
        const { user_id: userId } = req.body;

        if (!userId || userId !== req.session.userid) return res.status(403).send({ msg: 'Forbidden to update this record' });
        
        next();

    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}



module.exports = {
    canEditGivenUser,
}