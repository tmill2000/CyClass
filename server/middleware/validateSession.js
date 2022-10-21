module.exports = (req, res, next) => {
    if (
        !req?.body?.session_id ||
        !req.session.id ||
        req.body.session_id !== req.session.id
    ) {
        return res.status(403).send({ msg: 'Invalid Session' })
    } else {
        next();
    }
}