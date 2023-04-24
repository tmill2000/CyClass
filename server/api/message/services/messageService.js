const { runQuery } = require("../../../utils/db_connection");
const { writeLog } = require("../../../utils/logger");

/**
 * @typedef {Object} Message
 * @property {?number} message_id
 * @property {?number} parent_id
 * @property {?number} sender_id
 * @property {?number} lecture_id
 * @property {?string} timestamp
 * @property {?string} message_title
 * @property {?boolean} is_anonymous
 * @property {?string} body
 */

/**
 * @typedef {Object} Poll
 * @property {?number} poll_id
 * @property {?string} timestamp
 * @property {?string} question
 * @property {?string} close_date
 * @property {?boolean} closed
 * @property {?PollChoice[]} choices
 *
 */

/**
 * @typedef  {Object} PollChoice
 * @property {?number} poll_choice_id
 * @property {?string} text
 * @property {?boolean} is_correct_choice
 */

/**
 * Function to get a course
 * @param {number} messageId
 * @returns {Promise<Message[]>}
 */
const getMessage = async messageId => {
    try {
        const query =
            "SELECT messages.*, media_id, file_type, file_name from messages left join media_metadata on messages.message_id = media_metadata.message_id WHERE messages.message_id = ?;";
        const resp = await runQuery(query, [messageId]);
        return resp;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};
/**
 *
 * @param {number} lectureId
 * @param {string} timestamp
 * @returns {Promise<(Message & Poll)[]}
 */
const getMessagesAndPollsByLectureId = async (lectureId, timestamp) => {
    try {
        timestamp = timestamp != null ? new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ') : null;
        let query = `
        SELECT
            DISTINCT
                messages.sender_id,
                messages.timestamp,
                roles.role,
                users.netid,
                messages.body,
                messages.is_anonymous,
                messages.parent_id,
                messages.message_id,
                media_id,
                file_type,
                file_name
        FROM messages
            inner join roles
            on messages.sender_id = roles.user_id AND roles.course_id = (SELECT course_id from lectures where lecture_id = ?)
            inner join users 
            on messages.sender_id = users.user_id
            left join media_metadata
            on messages.message_id = media_metadata.message_id
        WHERE
            messages.lecture_id = ?
    `;
        query += timestamp
            ? "AND messages.timestamp < ? ORDER BY messages.timestamp DESC LIMIT 50;"
            : "ORDER BY messages.timestamp DESC LIMIT 50;";
        const options = timestamp ? [lectureId, lectureId, timestamp] : [lectureId, lectureId];
        const messages = await runQuery(query, options);
        const formattedMessages = messages.map(value => ({
            sender_id: value.sender_id,
            timestamp: new Date(value.timestamp).toISOString(),
            role: value.role,
            netid: value.netid,
            body: value.body,
            is_anonymous: !!value.is_anonymous,
            parent_id: value.parent_id,
            message_id: value.message_id,
            media_id: value.media_id,
            file_type: value.file_type,
            file_name: value.file_name
        }));
        query = `
        SELECT
        DISTINCT
            polls.poll_id,
            polls.timestamp,
            polls.question_text,
            polls.close_date,
            polls.poll_type,
            poll_choices.poll_choice_id,
            poll_choices.choice_text,
            poll_choices.is_correct_choice
        FROM polls
            inner join poll_choices
            ON polls.poll_id = poll_choices.poll_id
        WHERE 
            polls.lecture_id = ?
    `;
        query += timestamp
            ? "AND polls.timestamp < ? ORDER BY polls.timestamp DESC LIMIT 50;"
            : "ORDER BY polls.timestamp DESC LIMIT 50;";
        const polls = await runQuery(query, options);
        const pollMap = new Map();
        polls.forEach(value => {
            pollMap.set(value.poll_id, [...(pollMap.get(value.poll_id) ?? []), value]);
        });
        const formattedPolls = [];
        for (const [key, value] of pollMap) {
            formattedPolls.push({
                poll_id: key,
                timestamp: new Date(value[0].timestamp).toISOString(),
                question: value[0].question_text,
                close_date: value[0].close_date ? new Date(value[0].close_date).toISOString() : null,
                poll_type: value[0].poll_type,
                choices: value.map(item => ({
                    poll_choice_id: item.poll_choice_id,
                    text: item.choice_text,
                    is_correct_choice: !!item.is_correct_choice
                }))
            });
        }
        const data = formattedPolls.concat(formattedMessages).sort((a, b) => a.timestamp - b.timestamp);
        return data;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 *
 * @param {number} senderId
 * @param {string} body
 * @param {boolean} isAnonymous
 * @param {nuber} lectureId
 * @param {number} parentID
 * @returns {Promise<number>}
 */
const addMessage = async (senderId, body, isAnonymous, lectureId, parentID) => {
    try {
        const query = `INSERT INTO messages (
            sender_id, 
            lecture_id, 
            timestamp, 
            is_anonymous, 
            body,
            parent_id) VALUES
            (
                ?, ?, NOW(), ?, ?, ?
            );`;
        const resp = await runQuery(query, [senderId, lectureId, isAnonymous, body, parentID ?? null]);
        return resp.insertId;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 *
 * @param {string} mediaID
 * @param {number} courseID
 * @param {number} userID
 * @param {number} msgID
 * @returns {Promise<string>}
 */
const addMediaMetadata = async (mediaID, courseID, userID, msgID) => {
    try {
        const mediaQuery =
            "INSERT INTO media_metadata ( media_id, course_id, user_id, message_id, received, timestamp ) VALUES ( ?, ?, ?, ?, ?, NOW());";
        await runQuery(mediaQuery, [mediaID, courseID, userID, msgID, false]);
        return mediaID;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

/**
 *
 * @param {number} messageId
 */
const deleteMessage = async messageId => {
    try {
        const mediaQuery = "DELETE FROM media_metadata WHERE message_id = ?";
        const messageQuery = "DELETE FROM messages WHERE message_id = ?";
        await runQuery(mediaQuery, [messageId]);
        await runQuery(messageQuery, [messageId]);
    } catch (e) {
        writeLog("error", JSON.stringify(e));
        throw e;
    }
};

module.exports = {
    getMessage,
    getMessagesAndPollsByLectureId,
    addMessage,
    addMediaMetadata,
    deleteMessage
};
