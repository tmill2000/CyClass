const { runQuery } = require("../../../utils/db_connection");

/**
 * @typedef {Object} Poll
 * @property {?number} poll_id
 * @property {?string} timestamp
 * @property {?string} question
 * @property {?string} close_date
 * @property {?boolean} closed
 * @property {?PollChoice[]} choices
 */

/**
 * @typedef {Object} PollChoice
 * @param {number} poll_choice_id
 * @param {number} poll_id
 * @param {string} choice_text
 * @param {boolean} is_correct_choice
 */

/**
 * @typedef {Object} PollMetric
 * @param {nunber} poll_choice_id
 * @param {number} user_id
 * @param {boolean} is_correct_choice
 */

/**
 * @param {number} senderId
 * @param {number} lectureId
 * @param {string} questionText
 * @param {PollChoice[]} pollChoices
 * @param {string} pollType
 * @param {?string} closeDate
 * @returns {Promise<number>}
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
        closeDate = closeDate != null ? new Date(closeDate).toISOString().slice(0, 19).replace('T', ' ') : null;
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
 * @param {number} pollId
 * @returns {Promise<PollMetric[]>}
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
 * @param {number} pollId
 */
const closePoll = async pollId => {
    const query = "UPDATE polls SET close_date = NOW() WHERE poll_id = ?;";
    await runQuery(query, [pollId]);
};

/**
 * @param {number} pollId
 * @returns {Promise<Poll>}
 */
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
