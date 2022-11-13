const { runQuery } = require('../utils/db_connection');

module.exports = async (
    senderId,
    body,
    isAnonymous,
    lectureId,
    parentId,
) => {
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
        await runQuery(query, [
            senderId,
            lectureId,
            isAnonymous,
            body,
            parentId ?? null,
        ]);
    } catch (e) {
        console.error(e);
    }
}