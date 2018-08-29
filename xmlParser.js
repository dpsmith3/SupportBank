const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('xmlParser');
const transactionHandler = require('./transactionHandler');
const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();


function parseXmlFile(data, filename) {
    let parsedData;
    parser.parseString(data, function (err, result) {
        parsedData = result;
        if (err) {
            logger.error(err);
        }
    });
    const transactions = parsedData.TransactionList.SupportTransaction;
    const transactionsAsObjects = transactions.map((line, index) => {
        try {
            return parseXmlTransaction(line, index + 2, filename);
        } catch (err) {
            logger.error(err);
            console.log(`Error: ${err.message} This transaction has not been loaded.`);
            return null;
        }
    });
    logger.info('xml file loaded');
    return transactionsAsObjects;
}

function parseXmlTransaction(transaction, transactionNumber, filename) {
    return new transactionHandler.Transaction(
        moment("1900", "YYYY").add(transaction.$.Date, 'days'),
        transaction.Parties[0].From[0],
        transaction.Parties[0].To[0],
        transaction.Description[0],
        Number(transaction.Value[0])
    );
}

// const testFile = fs.readFileSync('./transactions/Transactions2012.xml');
// const parsedTestFile = parseXmlFile(testFile);
// console.log(parsedTestFile);

exports.parseXmlFile = parseXmlFile;