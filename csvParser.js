const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('csvParser');
const transactionHandler = require('./transactionHandler');

function parseCsvTransaction(line, lineNumber, filename) { // If transaction is valid, return transaction object. If transaction not valid, throw error.
    if (!moment(line[0], "DD-MM-YYYY").isValid()) {
        throw new Error(`'${line[0]}' on line ${lineNumber} in ${filename} could not be parsed as a date.`);
    } else if (!typeof line[1] === 'string') {
        throw new Error(`${line[1]} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (!typeof line[2] === 'string') {
        throw new Error(`${line[2]} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (!typeof line[3] === 'string') {
        throw new Error(`${line[3]} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (Number.isNaN(+line[4])) {
        throw new Error(`${line[4]} on line ${lineNumber} in ${filename} is not a number.`);
    } else {
        return new transactionHandler.Transaction(
            moment(line[0], "DD-MM-YYYY"),
            line[1],
            line[2],
            line[3],
            Number(line[4])
        );
    }
}

function parseCsvFile(rawData, filename) { // Takes in raw CSV data, checks for validity, logs any errors and discards faulty transactions, returning an array of valid Transaction objects.
    const allTransactions = rawData.split('\r\n') // Splits raw data into an array of lines
        .map((line, index) => line.split(',')) // Splits each line into an array of cells
        .slice(1) // Removes header line
        .map((line, index) => {
            try {
                return parseCsvTransaction(line, index + 2, filename);
            } catch (err) {
                logger.error(err);
                console.log(`Error: ${err.message} This transaction has not been loaded.`);
                return null;
            }
        });
    return allTransactions.filter(Boolean);
}

exports.parseCsvFile = parseCsvFile;