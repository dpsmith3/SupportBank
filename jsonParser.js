const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('jsonParser');
const transactionHandler = require('./transactionHandler');

// // TO DO: rewrite using generic parseFile helper function.

function parseJsonFile() {

}

// function getRawTransactionsFromJson(rawData) {
//     const rawTransactions = JSON.parse(rawData);
//     return rawTransactions;
// }

// function parseJsonTransaction(transaction, transactionIndex, filename) { 
//     const parsedTransaction = new transactionHandler.Transaction(
//             moment(transaction.Date, "DD-MM-YYYY"),
//             transaction.FromAccount,
//             transaction.ToAccount,
//             transaction.Narrative,
//             Number(transaction.Amount)
//         );
//         return transactionHandler.checkForTransactionError(parsedTransaction, transactionIndex - 1, filename);
// }

exports.parseJsonFile = parseJsonFile;