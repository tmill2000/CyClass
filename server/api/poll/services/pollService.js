const { runQuery } = require('../../../utils/db_connection');


/**
 * 
 * @param {*} senderId 
 * @param {*} lectureId 
 * @param {*} questionText 
 * @param {*} pollChoices []
 * @returns 
 */
const addPoll = async (senderId, lectureId, questionText, pollChoices) => {
    try {
        let query = `INSERT INTO polls 
                    (
                        sender_id,
                        lecture_id,
                        timestamp,
                        question_text
                    ) VALUES (
                        ?,
                        ?,
                        NOW(),
                        ?
                    );`
        const resp = await runQuery(query, [senderId, lectureId, questionText]);
        const choiceIds = [];
        for (pollChoice of pollChoices) {
            const { choice_text: choiceText, is_correct_choice: isCorrectChoice } = pollChoice
            const query = `INSERT INTO poll_choices (poll_id, choice_text, is_correct_choice) VALUES ( ?, ?, ?);`
            const res = await runQuery(query, [resp.insertId, choiceText, !!isCorrectChoice]);
            choiceIds.push(res.insertId);
        }
        return {
            pollId: resp.insertId,
            pollChoiceIds: choiceIds
        }
    } catch (e) {
        throw e
    }
}

module.exports = {
    addPoll
}