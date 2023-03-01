const fs = require('fs');

const writeLog = (content) => {
    console.log("writing")
    let contentToWrite = content;
    if ( typeof contentToWrite === 'object' ) {
        contentToWrite = JSON.stringify(contentToWrite, null, "\t");
    }

    contentToWrite = `\n\n${new Date().toISOString()}\t`.concat(contentToWrite);

    fs.appendFileSync("./app.log", contentToWrite);
};

module.exports = { writeLog };
