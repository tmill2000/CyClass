const { runQuery } = require("../../utils/db_connection");
const { writeLog } = require("../../utils/logger");

const editableFields = {
    courses: [],
    lectures: [],
    media_metadata: [],
    messages: ["message_title", "is_anonymous", "body"],
    poll_choices: ["choice_text", "is_correct_choice"],
    poll_responses: ["response_id"],
    polls: ["question_text", "close_date"],
    roles: [],
    users: ["netid", "password", "first_name", "last_name"]
};

/**
 * Service to update data objects
 * @param {*} tableName Name of table, should be hard-coded in calling backend function to avoid SQL injection
 * @param {*} newValsObj Object with modified column names as keys and desired new values as values
 * @param {*} whereClauseCol Column name to based WHERE statement off of, should be hard-coded in calling backend function to avoid SQL injection
 * @param {*} whereClauseVal Value to base WHERE statement on
 */
const genericPatch = async (tableName, newValsObj, whereClauseCol, whereClauseVal) => {
    const updatesToMake = [],
        insertValues = [];
    try {
        Object.keys(newValsObj).forEach(objKey => {
            // Check to ensure all included fields are eligible to be edited
            if (!editableFields[tableName].includes(objKey)) return;

            updatesToMake.push(`${objKey} = ?`);
            insertValues.push(newValsObj[objKey]);
        });

        const joinedUpdates = updatesToMake.join(", ");
        const query = `UPDATE ${tableName} SET ${joinedUpdates} WHERE ${whereClauseCol} = ?`;

        writeLog("debug", query);

        const resp = await runQuery(query, [...insertValues, whereClauseVal]);
        return resp;
    } catch (e) {
        writeLog("error", e.message);
        throw e;
    }
};

module.exports = {
    genericPatch
};
