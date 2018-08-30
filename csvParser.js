const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('csvParser');
const transactionHandler = require('./transactionHandler');

function getRawTransactionsFromCsv(rawData) {
    const rawTransactions = rawData.split('\r\n')
            .map((transaction, index) => transaction.split(','))
            .slice(1)
    return rawTransactions;
}

function parseCsvTransaction(transaction, lineNumber, filename) {
    const parsedTransaction = new transactionHandler.Transaction(
            moment(transaction[0], "DD-MM-YYYY"),
            transaction[1],
            transaction[2],
            transaction[3],
            Number(transaction[4])
        );
    return transactionHandler.validateTransaction(parsedTransaction, lineNumber + 1, filename);
}

exports.parseCsvTransaction = parseCsvTransaction;
exports.getRawTransactionsFromCsv = getRawTransactionsFromCsv;