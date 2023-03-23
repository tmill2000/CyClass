const { runQuery } = require("../../../utils/db_connection");

/**
 *
 * @param {number} senderId
 * @param {number} lectureId
 * @param {string} questionText
 * @param {PollChoice[]} pollChoices []
 * @param {string} pollType
 * @param {?string} closeDate
 * @returns
 */
const addPoll = async (senderId, lectureId, questionText, pollChoices, pollType, closeDate) => {
    try {
        let query = `INSERT INTO polls 
                    (
                        sender_id,
                        lecture_id,
                        timestamp,
                        question_text,
                        close_date,
                        poll_type
                    ) VALUES (
                        ?,
                        ?,
                        NOW(),
                        ?,
                        ?,
                        ?
                    );`;
        const resp = await runQuery(query, [senderId, lectureId, questionText, closeDate, pollType]);
        const choiceIds = [];
        for (const pollChoice of pollChoices) {
            const { choice_text: choiceText, is_correct_choice: isCorrectChoice } = pollChoice;
            const query = "INSERT INTO poll_choices (poll_id, choice_text, is_correct_choice) VALUES ( ?, ?, ?);";
            const res = await runQuery(query, [resp.insertId, choiceText, !!isCorrectChoice]);
            choiceIds.push(res.insertId);
        }
        return {
            pollId: resp.insertId,
            pollChoiceIds: choiceIds
        };
    } catch (e) {
        throw e;
    }
};

/**
 *
 * @param {*} pollId
 * @returns list of poll responses
 */
const getPollMetrics = async pollId => {
    const query = `
    SELECT
        distinct poll_responses.response_id as "poll_choice_id",
        poll_responses.user_id,
        poll_choices.is_correct_choice
    FROM poll_responses
        inner join poll_choices on poll_responses.poll_id = poll_choices.poll_id
    WHERE 
        poll_responses.poll_id = ?
    AND
        poll_responses.response_id = poll_choices.poll_choice_id;`;
    const resp = await runQuery(query, [pollId, pollId, pollId]);
    return resp;
};

/**
 *
 * @param {*} pollId
 */
const closePoll = async pollId => {
    const query = "UPDATE polls SET close_date = NOW() WHERE poll_id = ?;";
    await runQuery(query, [false, pollId]);
};

const getPollById = async pollId => {
    const query =
        "SELECT * from polls INNER JOIN poll_choices ON polls.poll_id = poll_choices.poll_id where polls.poll_id = ?";
    const resp = await runQuery(query, [pollId]);
    return resp;
};

module.exports = {
    addPoll,
    getPollMetrics,
    closePoll,
    getPollById
};
