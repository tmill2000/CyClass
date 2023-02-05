module.exports = (req, res, next) => {
    const xSessionId = req.headers['x-session-id']
    if(process.env.NODE_ENV === 'devl'){
        next();
    } else if(!xSessionId || !req.session.sessionId ||(xSessionId !== req.session.sessionId)
    ) {
        return res.status(403).send({ msg: 'Invalid Session' })
    } else {
        next();
    }
}