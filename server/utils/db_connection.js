const mysql = require('mysql');
const util = require('util');


const makeDb = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
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