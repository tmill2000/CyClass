const { runQuery } = require('../../utils/db_connection');

const getMessagesAndPollsByLectureId = async (req, res) => {
    try{
    const { lecture_id: lectureId, timestamp } = req.query;
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
    query += timestamp ? 'AND messages.timestamp > ?;' : ';';
    const options = timestamp ? [lectureId, timestamp] : [lectureId];
    const messages = await runQuery(query, options);
    query = `
    SELECT
        polls.poll_id,
        polls.timestamp,
        polls.question_text,
        poll_choices.poll_choice_id,
        poll_choices.choice_text,
        poll_choices.is_correct_choice
    FROM polls
        inner join poll_choices
        ON polls.poll_id = poll_choices.poll_id
    WHERE 
        polls.lecture_id = ?
    `
    query += timestamp ? 'AND polls.timestamp > ?;' : ';';
    const polls = await runQuery(query, options);
    const pollMap = new Map();
    polls.forEach((value) => {
        pollMap.set(value.poll_id, [...(pollMap.get(value.poll_id) ?? []), value])
    })
    const formatted = [];
    for( const [key, value] of pollMap){
        formatted.push({
            poll_id: key,
            timestamp: value[0].timestamp,
            question: value[0].question_text,
            choices: value.map((item) => ({
                poll_choice_id: item.poll_choice_id,
                text: item.choice_text,
                is_correct_choice: !!item.is_correct_choice
            }))
        })
    }
    const data = formatted.concat(messages).sort((a, b) => a.timestamp - b.timestamp);
    res.status(200).send(data);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getMessagesAndPollsByLectureId
}