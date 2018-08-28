const moment = require('moment');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('jsonParser');
const transactionHandler = require('./transactionHandler');

function parseJson(rawData, filename) {
    return JSON.parse(rawData);
}

// // TESTING LINES:
// const testFile = fs.readFileSync('./Transactions2013.json', "utf8");
// console.log("Raw file: ", testFile[0]);
// const parsedFile = JSON.parse(testFile);
// console.log("JSON.parse(file): ", parsedFile[0]);

exports.parseJson = parseJson;