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

function parseJsonTransaction(transaction, lineNumber, filename) { 
    const parsedTransaction = new transactionHandler.Transaction(
            moment(transaction.Date, "DD-MM-YYYY"),
            transaction.FromAccount,
            transaction.ToAccount,
            transaction.Narrative,
            Number(transaction.Amount)
        );
        return transactionHandler.validateTransaction(parsedTransaction);
}

exports.parseJsonFile = parseJsonFile;