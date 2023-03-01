const fs = require('fs');

const logTypes = {
    debug: "./debug.log",
    error: "./error.log",
    general: "./general.log"
}

// TODO: Function to delete log file(s) on server restart?

/**
 * Utility function to output logs to file on server
 * When run locally, log files will be at same level as logger.js
 * When run on server, log files will be at same level as server.js
 * @param {String} logType Should be one of ["debug", "error", "general"] If not or undefined, will default to general
 * @param {*} content Content to be formatted and written to selected log file
 */
const writeLog = (logType, content) => {
    const logFileName = logTypes[logType] || logTypes["general"];
    console.log(logFileName);
    let contentToWrite = content;
    if ( typeof contentToWrite === 'object' ) {
        contentToWrite = JSON.stringify(contentToWrite, null, "\t");
    }

    contentToWrite = `\n\n${new Date().toISOString()}\t`.concat(contentToWrite);

    fs.appendFileSync(logFileName, contentToWrite);
};

module.exports = { writeLog };
