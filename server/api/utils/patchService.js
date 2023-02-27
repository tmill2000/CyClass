const { runQuery } = require('../../utils/db_connection');

/**
 * Service to update data objects
 * @param {*} tableName Name of table, should be hard-coded in calling backend function to avoid SQL injection
 * @param {*} newValsObj Object with modified column names as keys and desired new values as values
 * @param {*} whereClauseCol Column name to based WHERE statement off of, should be hard-coded in calling backend function to avoid SQL injection
 * @param {*} whereClauseVal Value to base WHERE statement on
 */
const genericPatch = async (tableName, newValsObj, whereClauseCol, whereClauseVal) => {
    const updatesToMake = [], insertValues = [];
    try {
        Object.keys(newValsObj).forEach((objKey) => {
            updatesToMake.push(`${objKey} = ?`);
            insertValues.push(newValsObj[objKey]);
        });

        // TODO: function to make sure keys in newValsObj don't allow for sql injection

        const joinedUpdates = updatesToMake.join(", ");
        const query = `UPDATE ${tableName} SET ${joinedUpdates} WHERE ${whereClauseCol} = ?`;

        const resp = await runQuery(query, [...insertValues, whereClauseVal]);
        return resp;

    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    genericPatch
}
