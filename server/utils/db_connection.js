const mysql = require('mysql');
const util = require('util');


const makeDb = () => {
    const connection = mysql.createConnection({
        host: process.env.db_host || 'localhost',
        user: process.env.db_user || 'root',
        password: process.env.db_password || 'password',
        database: process.env.db || 'db',
        port: 3306
    });
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}

const runQuery = async (query, inserts) => {
    const db = makeDb();
    try {
        const cleanQuery = mysql.format(query, inserts);
        const rows = await db.query(cleanQuery);
        return rows;
    } catch (e) {
        throw e;
    } finally {
        await db.close();
    }
}

module.exports = { runQuery }