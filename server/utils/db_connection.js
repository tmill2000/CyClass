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
    console.log(db)

    try {
        const cleanQuery = mysql.format(query, inserts);
        console.log(cleanQuery)
        const rows = await db.query(cleanQuery);
        console.log(rows)
        return rows;
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
        if(db)
        await db.close();
    }
}

module.exports = { runQuery }