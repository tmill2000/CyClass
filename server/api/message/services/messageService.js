const { runQuery } = require('../../../utils/db_connection');


/**
 * Function to get a course
 * @param {*} messageId 
 * @param {*} res 
 * @returns course data if successful, otherwise a 500 or 400 error
 */
const getMessage = async (messageId) => {
    try {
        const query = 'SELECT * from messages WHERE message_id = ?;';
        const resp = await runQuery(query, [messageId]);
        return resp
    } catch (e) {
        console.error(e);
        throw e
    }
}
/**
 * 
 * @param {*} lectureId 
 * @param {*} timestamp 
 * @returns messages and polls
 */
const getMessagesAndPollsByLectureId = async (lectureId, timestamp) => {
    try {
        let query = `
        SELECT
            messages.sender_id,
            messages.timestamp,
            roles.role,
            users.netid,
            messages.body,
            messages.is_anonymous,
            messages.parent_id,
            messages.message_id
        FROM messages
            inner join roles
            on messages.sender_id = roles.user_id
            inner join users 
            on messages.sender_id = users.user_id
        WHERE
            messages.lecture_id = ?
    `;
        query += timestamp ? 'AND messages.timestamp < ? LIMIT 50;' : 'LIMIT 50;';
        const options = timestamp ? [lectureId, timestamp] : [lectureId];
        const messages = await runQuery(query, options);
        const formattedMessages = messages.map((value) => ({
            sender_id: value.sender_id,
            timestamp: new Date(value.timestamp).toISOString(),
            role: value.role,
            netid: value.netid,
            body: value.body,
            is_anonymous: !!value.is_anonymous,
            parent_id: value.parent_id,
            message_id: value.message_id
        }));
        query = `
        SELECT
            polls.poll_id,
            polls.timestamp,
            polls.question_text,
            polls.close_date,
            polls.is_open,
            poll_choices.poll_choice_id,
            poll_choices.choice_text,
            poll_choices.is_correct_choice
        FROM polls
            inner join poll_choices
            ON polls.poll_id = poll_choices.poll_id
        WHERE 
            polls.lecture_id = ?
    `
        query += timestamp ? 'AND polls.timestamp < ? LIMIT 50;' : 'LIMIT 50;';
        const polls = await runQuery(query, options);
        const pollMap = new Map();
        polls.forEach((value) => {
            pollMap.set(value.poll_id, [...(pollMap.get(value.poll_id) ?? []), value])
        })
        const formattedPolls = [];
        for (const [key, value] of pollMap) {
            formattedPolls.push({
                poll_id: key,
                timestamp: new Date(value[0].timestamp).toISOString(),
                question: value[0].question_text,
                close_date: value[0].close_date ? new Date(value[0].close_date).getTime() : null,
                closed: !value[0].is_open,
                choices: value.map((item) => ({
                    poll_choice_id: item.poll_choice_id,
                    text: item.choice_text,
                    is_correct_choice: !!item.is_correct_choice
                }))
            })
        }
        const data = formattedPolls.concat(formattedMessages).sort((a, b) => a.timestamp - b.timestamp);
        return data
    } catch (err) {
        console.error(err);
    }
}

/**
 * 
 * @param {*} senderId 
 * @param {*} body
 * @param {*} isAnonymous
 * @param {*} lectureId
 * @param {*} parentID
 * @returns message_id of created message
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
            );`
        const resp = await runQuery(query, [
            senderId,
            lectureId,
            isAnonymous,
            body,
            parentID ?? null,
        ]);
        return resp.insertId
    } catch (e) {
        console.error(e);
        throw e
    }
}

const addMediaMetadata = async (mediaID, courseID, userID, msgID) => {
    try {
        const mediaQuery = `INSERT INTO media_metadata ( media_id, course_id, user_id, message_id, received, timestamp ) VALUES ( ?, ?, ?, ?, ?, NOW());`;
        await runQuery(mediaQuery, [mediaID, courseID, userID, msgID, false]);
        return mediaID;
    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    getMessage,
    getMessagesAndPollsByLectureId,
    addMessage,
    addMediaMetadata
}