const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('csvParser');
const transactionHandler = require('./transactionHandler');
const parsingFunctions = require('./parsingFunctions');

function getRawTransactionsFromCsv(rawData) {
    // Returns an array of transactions. Each transaction is an array.
    const rawTransactions = rawData.split('\r\n')
            .map((transaction, index) => transaction.split(','))
            .slice(1);
    return rawTransactions;
}

function parseCsvTransaction(transaction) {
    const rawValues = {
        date: transaction[0],
        from: transaction[1],
        to: transaction[2],
        narrative: transaction[3],
        amount: transaction[4]
    };

    const parsedTransaction = new transactionHandler.Transaction(
        moment(transaction[0], "DD-MM-YYYY"),
        transaction[1],
        transaction[2],
        transaction[3],
        Number(transaction[4])
    );

    return {
        raw: rawValues,
        result: parsedTransaction
    };
}

function parseCsvFile(rawData, filename) {
    return parsingFunctions.parseFile(rawData, filename, getRawTransactionsFromCsv, parseCsvTransaction);
}

exports.parseCsvFile = parseCsvFile;