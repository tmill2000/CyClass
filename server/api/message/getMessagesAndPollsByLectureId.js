const messageService = require('./services/messageService')

const getMessagesAndPollsByLectureId = async (req, res) => {
    try{
    const { lecture_id: lectureId, timestamp } = req.query;
    if(!lectureId){
        return res.status(400).send('Missing Parameters')
    }
    const resp = await messageService.getMessagesAndPollsByLectureId(lectureId, timestamp)
    return res.status(200).send(resp);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    getMessagesAndPollsByLectureId
}