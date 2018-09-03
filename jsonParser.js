const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('jsonParser');
const transactionHandler = require('./transactionHandler');
const parsingFunctions = require('./parsingFunctions');

function getRawTransactionsFromJson(rawData) {
    // Returns an array of transactions. Each transaction is an object.
    return JSON.parse(rawData);
}

function parseJsonTransaction(transaction) { 
    const rawValues = {
        date: transaction.Date,
        from: transaction.FromAccount,
        to: transaction.ToAccount,
        narrative: transaction.Narrative,
        amount: transaction.Amount
    };
    
    const parsedTransaction = new transactionHandler.Transaction(
            moment(transaction.Date, "DD-MM-YYYY"),
            transaction.FromAccount,
            transaction.ToAccount,
            transaction.Narrative,
            Number(transaction.Amount)
        );
    
    return {
        raw: rawValues,
        result: parsedTransaction
    };
}

function parseJsonFile(rawData, filename) {
    return parsingFunctions.parseFile(rawData, filename, getRawTransactionsFromJson, parseJsonTransaction);
}

exports.parseJsonFile = parseJsonFile;