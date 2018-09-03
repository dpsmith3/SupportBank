const moment = require('moment');
const momentMsdate = require("moment-msdate");
const log4js = require('log4js');
const logger = log4js.getLogger('xmlParser');
const transactionHandler = require('./transactionHandler');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

// TO DO: rewrite using generic parseFile helper function.
function parseXmlFile() {
    
}

// function getRawTransactionsFromXml(rawData) {
//     let parsedData;
//     parser.parseString(rawData, function (err, result) {
//         parsedData = result;
//         if (err) {
//             logger.error(err);
//         }
//     });
//     const rawTransactions = parsedData.TransactionList.SupportTransaction;
//     return rawTransactions;
// }

// function parseXmlTransaction(transaction, lineNumber, filename) {
//     const parsedTransaction = new transactionHandler.Transaction(
//         moment.fromOADate(transaction.$.Date),
//         transaction.Parties[0].From[0],
//         transaction.Parties[0].To[0],
//         transaction.Description[0],
//         Number(transaction.Value[0])
//     );
//     return transactionHandler.checkForTransactionError(parsedTransaction, lineNumber - 1, filename);
// }

exports.parseXmlFile = parseXmlFile;