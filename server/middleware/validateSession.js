module.exports = (req, res, next) => {
    if(process.env.NODE_ENV === 'devl'){
        next();
    } else if(
        (!req?.body?.session_id && !req.query.session_id) ||
        !req.session.id ||
        (req.body.session_id !== req.session.id && req.query.session_id !== req.session.id)
    ) {
        return res.status(403).send({ msg: 'Invalid Session' })
    } else {
        next();
    }
}