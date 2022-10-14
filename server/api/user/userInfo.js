const { runQuery } = require('../../utils/db_connection');

const getUserInfoByUserId = async (req, res) => {
    try {
        const userId = req?.query?.id;
        if (!userId) {
            return res.status(400).send('Invalid Parameters')
        }
        const query = 'SELECT * FROM users WHERE user_id = ?';
        const rows = await runQuery(query, [userId]);
        return res.status(200).send(rows.length ? rows[0] : {});
    } catch (e) {
        return res.status(500).send('Internal Server Error')
    }
}

module.exports = { getUserInfoByUserId }