const { runQuery } = require('../../utils/db_connection');

/**
 * 
 * @param {*} req 
 * req.body = {
 *    sender_id: int,
 *    lecture_id: int,
 *    question_text: string
 * }
 * @param {*} res 
 * @returns poll_id of created poll
 */
const addPoll = async (req, res) => {
    try {
        const { sender_id: senderId, lecture_id: lectureId, question_text: questionText } = req.body;
        if (!senderId || !lectureId || !questionText) {
            return res.status(400).send({ msg: "Invalid Question" })
        }
        const query = 'INSERT INTO polls (sender_id, lecture_id, timestamp, question_text) VALUES(?, ?, NOW(), ?);';
        //insert and save id
        // choices.forEach((choice) => {
        //     query+=//content;
        // })
        const resp = await runQuery(query, [
            senderId,
            lectureId,
            questionText,
        ]);
        return res.status(201).send({ poll_id: resp.insertId })
    } catch (e){
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

//the return of the poll id in addPoll, should be passed in the pollId of the addpollchoices method in order to 
//need to grab the users choices

/**
 * 
 * @param {*} req 
 * req.body = {
 *    poll_id: int,
 *    is_correct_choice: bool,
 *    choice_text: string
 * }
 * @param {*} res 
 * @returns poll_choice_id of specific poll
 */
 const addPollChoices = async (req, res) => {
    try {
        const { poll_id: pollId, is_correct_choice: isCorrectChoice, choice_text } = req.body;
        if (!pollId || !isCorrectChoice || !choice_text) {
            return res.status(400).send({ msg: "Invalid Choice" })
        }
        const query = 'INSERT INTO poll_choices (poll_id, is_correct_choice, choice_text) VALUES(?, ?, ?);';
        const resp = await runQuery(query, [
            pollId,
            isCorrectChoice,
            choice_text,
        ]);
        return res.status(201).send({ poll_choice_id: resp.insertId })
    } catch (e){
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' })
    }
}

module.exports = {
    addPoll,
    addPollChoices,
}