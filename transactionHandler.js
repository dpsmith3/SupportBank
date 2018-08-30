const moment = require('moment');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('transactionHandler');
const csvParser = require('./csvParser.js');
const jsonParser = require('./jsonParser.js');
const xmlParser = require('./xmlParser.js');

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

function readFileTypeAndParse(rawTransactions, filename) {
    if (filename.slice(-4) === '.csv') {
        return csvParser.parseCsvFile(rawTransactions, filename);
    } else if (filename.slice(-5) === '.json') {
        return jsonParser.parseJsonFile(rawTransactions, filename);
    } else if (filename.slice(-4) === '.xml') {
        return xmlParser.parseXmlFile(rawTransactions, filename);
    } else {
        const e = new Error(`${filename} - file type not recognised.`);
        logger.error(e);
        console.log(e);
        throw e;
    }
}


function validateTransaction(parsedTransaction, lineNumber, filename) {
    if (!parsedTransaction.date.isValid()) {
        throw new Error(`'${parsedTransaction.date}' on line ${lineNumber} in ${filename} could not be parsed as a date.`);
    } else if (!typeof parsedTransaction.from === 'string') {
        throw new Error(`${parsedTransaction.from} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (!typeof parsedTransaction.to === 'string') {
        throw new Error(`${parsedTransaction.to} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (!typeof parsedTransaction.narrative === 'string') {
        throw new Error(`${parsedTransaction.narrative} on line ${lineNumber} in ${filename} is not a string.`);
    } else if (Number.isNaN(parsedTransaction.amount)) {
        throw new Error(`${parsedTransaction.amount} on line ${lineNumber} in ${filename} is not a number.`);
    } else {
        return parsedTransaction;
    }    
}


//TO DO: error handling for incorrect file path
function loadFile(filename, folderPath = './transactions') {
    logger.info(`Loading ${folderPath}/${filename}`);
    const rawTransactions = fs.readFileSync(`${folderPath}/${filename}`, "utf8");
    return readFileTypeAndParse(rawTransactions, filename); 
}

//TO DO: error handling for incorrect folder path
function loadFolder(folderPath) {
    logger.info(`Loading transactions from ${folderPath}`);
    var allTransactions = [];
    const filenames = fs.readdirSync(folderPath);
    filenames.forEach((filename) => {
        const fileTransactions = loadFile(filename, folderPath);
        fileTransactions.forEach(transaction => allTransactions.push(transaction));
    });
    logger.info('Finished loading transactions.');
    return allTransactions;
}

exports.loadFile = loadFile;
exports.loadFolder = loadFolder;
exports.Transaction = Transaction;
exports.validateTransaction = validateTransaction;