const moment = require('moment');
const momentMsdate = require("moment-msdate");
const log4js = require('log4js');
const logger = log4js.getLogger('xmlParser');
const transactionHandler = require('./transactionHandler');
const parsingFunctions = require('./parsingFunctions');

const xml2js = require('xml2js');
const parser = new xml2js.Parser();

function getRawTransactionsFromXml(rawData) {
    // Returns an array of transactions. Each transaction is an object.
    let parsedData;
    parser.parseString(rawData, function (err, result) {
        parsedData = result;
        if (err) {
            logger.error(err); 
        }
    });
    const rawTransactions = parsedData.TransactionList.SupportTransaction;
    return rawTransactions;
}

function parseXmlTransaction(transaction) {
    const rawValues = {
        date: transaction.$.Date,
        from: transaction.Parties[0].From[0],
        to: transaction.Parties[0].To[0],
        narrative: transaction.Description[0],
        amount: transaction.Value[0]
    };

    let parsedDate;
    try {
        parsedDate = moment.fromOADate(transaction.$.Date);
    } catch (err) {
        logger.error(err);
        parsedDate = moment(null); // Creates intentionally invalid moment that will fail the moment().isValid() test in checkForTransactionError().
    }

    parsedTransaction = new transactionHandler.Transaction(
        parsedDate,
        transaction.Parties[0].From[0],
        transaction.Parties[0].To[0],
        transaction.Description[0],
        Number(transaction.Value[0])
    );
    
    return {
        raw: rawValues,
        result: parsedTransaction
    };
}

function parseXmlFile(rawData, filename) {
    return parsingFunctions.parseFile(rawData, filename, getRawTransactionsFromXml, parseXmlTransaction);
}

exports.parseXmlFile = parseXmlFile;