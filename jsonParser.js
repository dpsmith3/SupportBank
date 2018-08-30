const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('jsonParser');
const transactionHandler = require('./transactionHandler');

function getRawTransactionsFromJson(rawData) {
    const rawTransactions = JSON.parse(rawData);
    return rawTransactions;
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

exports.parseJsonTransaction = parseJsonTransaction;
exports.getRawTransactionsFromJson = getRawTransactionsFromJson;