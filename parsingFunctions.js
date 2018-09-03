const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('parsingFunctions');

function checkForTransactionError(parsedTransaction) {
    let errValue;
    if (!parsedTransaction.date.isValid()) {
        errValue = 'date';
    } else if (!typeof parsedTransaction.from === 'string') {
        errValue = 'to';
    } else if (!typeof parsedTransaction.to === 'string') {
        errValue = 'from';
    } else if (!typeof parsedTransaction.narrative === 'string') {
        errValue = 'narrative';
    } else if (Number.isNaN(parsedTransaction.amount)) {
        errValue = 'amount';
    } else {
        errValue = null;
    }
    return errValue;
}

function parseFile(rawData, filename, getRawTransactionsCallback, parseTransactionCallback) {
    // Handles procedural logic which is common to all parsing modules.
    const validTransactions = [];
    const rawTransactions = getRawTransactionsCallback(rawData);
    rawTransactions.forEach((transaction, index) => {
        let parsedTransaction;
        parsedTransaction = parseTransactionCallback(transaction);
        const errValue = checkForTransactionError(parsedTransaction.result);
        if (errValue === null) {
            validTransactions.push(parsedTransaction.result);
        } else {
            const e = new Error(`Invalid ${errValue} '${parsedTransaction.raw[errValue]}' in transaction number ${index + 1} in file ${filename}. This transaction has not been loaded.`);
            logger.error(e);
            console.log(e.message); 
        }
    });
    return validTransactions;
}

exports.parseFile = parseFile;