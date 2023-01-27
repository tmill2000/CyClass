const messageService = require('./services/messageService')

const getMessagesAndPollsByLectureId = async (req, res) => {
    try{
    const { lecture_id: lectureId, timestamp } = req.query;
    const resp = await messageService.getMessagesAndPollsByLectureId(lectureId, timestamp)
    res.status(200).send(resp);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getMessagesAndPollsByLectureId
}