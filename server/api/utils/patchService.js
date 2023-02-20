const { runQuery } = require('../../utils/db_connection');

/**
 * Service to update data objects
 * @param {*} tableName Name of table
 * @param {*} newValsObj Object with modified column names as keys and desired new values as values
 * @param {*} whereClauseCol Column name to based WHERE statement off of
 * @param {*} whereClauseVal Value to base WHERE statement on
 */
const genericPatch = async (tableName, newValsObj, whereClauseCol, whereClauseVal) => {
    const updatesToMake = [], newVals = [];
    try {
        Object.keys(newValsObj).forEach((objKey) => {

            updatesToMake.push(`${objKey} = ?`);
            newVals.push(fields2Chg[objKey]);
            
        });
        const joinedUpdates = updatesToMake.join(", ");
        const query = `UPDATE ${tableName} SET ${joinedUpdates} WHERE ${whereClauseCol} = ?`;

        const resp = await runQuery(query, [...newVals, whereClauseVal]);

        return resp;

    } catch (e) {
        console.error(e);
        throw e
    }
}

module.exports = {
    genericPatch
}
