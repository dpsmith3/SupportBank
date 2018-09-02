const moment = require('moment');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('transactionHandler');
const csvParser = require('./csvParser.js');
const jsonParser = require('./jsonParser.js');
const xmlParser = require('./xmlParser.js');
const path = require('path');

class Transaction {
    constructor(date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }

    displayTransaction() {
        const result = `
Date: ${this.date.format("dddd, MMMM Do YYYY")}
From: ${this.from}
To: ${this.to}
Narrative: ${this.narrative}
Amount: ${this.amount}`;
        console.log(result);
    }
}

function validateTransaction(parsedTransaction, transactionNumber, filename) {
    let err;
    if (!parsedTransaction.date.isValid()) {
        err = 'Invalid date';
    } else if (!typeof parsedTransaction.from === 'string') {
        err = 'Invalid "to" name';
    } else if (!typeof parsedTransaction.to === 'string') {
        err = 'Invalid "from" name';
    } else if (!typeof parsedTransaction.narrative === 'string') {
        err = 'Invalid description';
    } else if (Number.isNaN(parsedTransaction.amount)) {
        err = 'Invalid amount';
    }

    if (err) {
        throw new Error(`${err} in transaction ${transactionNumber} in ${filename}.`);
    } else {
        return parsedTransaction;    
    }
}

function getTransactions(rawData, filename, parseFile, parseTransaction) {
    const rawTransactions = parseFile(rawData);
    const transactions = rawTransactions.map((transaction, index) => {
        try {
            return parseTransaction(transaction, index, filename);
        } catch (err) {
            logger.error(err);
            console.log(`${err.message} This transaction has not been loaded.`);
            return null;
        }
    });
    return transactions.filter(Boolean);
}

function importFile(filename, folderPath = './transactions') {
    logger.info(`Loading file ${folderPath}/${filename}`);
    const rawData = fs.readFileSync(`${folderPath}/${filename}`, "utf8");
    const filetype = path.extname(filename);
    let parseFile, parseTransaction;
    if (filetype === '.csv') {
        parseFile = csvParser.getRawTransactionsFromCsv;
        parseTransaction = csvParser.parseCsvTransaction;
    } else if (filetype === '.json') {
        parseFile = jsonParser.getRawTransactionsFromJson;
        parseTransaction = jsonParser.parseJsonTransaction;
    } else if (filetype === '.xml') {
        parseFile = xmlParser.getRawTransactionsFromXml;
        parseTransaction = xmlParser.parseXmlTransaction;
    }
    const transactions = getTransactions(rawData, filename, parseFile, parseTransaction)
    return transactions;
}

function loadFolder(folderPath) {
    logger.info(`Loading transactions from ${folderPath}`);
    const allTransactions = [];
    const filenames = fs.readdirSync(folderPath);
    filenames.forEach((filename) => {
        const fileTransactions = importFile(filename, folderPath);
        fileTransactions.forEach(transaction => allTransactions.push(transaction));
        logger.info(`Finished loading transactions from ${filename}`);
    });
    return allTransactions;
}

exports.importFile = importFile;
exports.loadFolder = loadFolder;
exports.Transaction = Transaction;
exports.validateTransaction = validateTransaction;