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

// TO DO:
function importFile(filename, folderPath = './transactions') {
    logger.info(`Loading file ${folderPath}/${filename}`);
    const rawData = fs.readFileSync(`${folderPath}/${filename}`, "utf8");
    const filetype = path.extname(filename);
    if (filetype === '.csv') {
        return csvParser.parseCsvFile(rawData, filename);
    } else if (filetype === '.json') {
        return jsonParser.parseJsonFile(rawData, filename);
    } else if (filetype === '.xml') {
        return xmlParser.parseXmlFile(rawData, filename);
    }

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