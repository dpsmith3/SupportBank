const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('jsonParser');
const transactionHandler = require('./transactionHandler');

function parseJsonFile(rawData, filename) {
    const rawTransactions = JSON.parse(rawData);
    allTransactions = rawTransactions.map((line, index) => { 
        try {
            return parseJsonTransaction(line, index, filename);
        } catch (err) {
            logger.error(err);
            console.log(`Error: ${err.message} This transaction has not been loaded.`);
            return null;
        }
    });
    return allTransactions.filter(Boolean);
}

function parseJsonTransaction(transaction, lineNumber, filename) { // If transaction is valid, return transaction object. If transaction not valid, throw error.
    if (!moment(transaction.Date, "YYYY-MM-DD").isValid()) {
        throw new Error(`'${transaction.Date}' on line ${lineNumber} in ${filename} could not be parsed as a date.`);
    } else if (!typeof transaction.FromAccount === 'string') {
        throw new Error(`${transaction.FromAccount} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (!typeof transaction.ToAccount === 'string') {
        throw new Error(`${transaction.ToAccount} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (!typeof transaction.Narrative === 'string') {
        throw new Error(`${transaction.Narrative} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (Number.isNaN(+transaction.Amount)) {
        throw new Error(`${transaction.Amount} on line ${lineNumber} in ${filename} is not a number.`);
    } else {
        return new transactionHandler.Transaction(
            moment(transaction.Date, "DD-MM-YYYY"),
            transaction.FromAccount,
            transaction.ToAccount,
            transaction.Narrative,
            Number(transaction.Amount)
        );
    }
}

exports.parseJsonFile = parseJsonFile;