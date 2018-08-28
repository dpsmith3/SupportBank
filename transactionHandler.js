const moment = require('moment');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('transactionsLoader');
const csvParser = require('./csvParser.js');
const jsonParser = require('./jsonParser.js');

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
    } else {
        const e = new Error(`${filename} - file type not recognised.`);
        logger.error(e);
        console.log(e);
        throw e;
    }
}

function loadTransactions(folderPath) {
    logger.info(`Loading transactions from ${folderPath}`);
    var allTransactions = [];
    const filenames = fs.readdirSync(folderPath);
    filenames.forEach(filename => {
        logger.info(`Loading ${folderPath}/${filename}`);
        const rawTransactions = fs.readFileSync(`./transactions/${filename}`, "utf8");
        const transactions = readFileTypeAndParse(rawTransactions, filename); 
        transactions.forEach(transaction => allTransactions.push(transaction));
    })
    logger.info('Finished loading transactions.');
    return allTransactions;
}

exports.loadTransactions = loadTransactions;
exports.Transaction = Transaction;