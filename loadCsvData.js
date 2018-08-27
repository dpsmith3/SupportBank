const moment = require('moment');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('loadCsvData');

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

function parseCsvTransactionLine(line, lineNumber, filename) {
    { // Checks that data is valid and replaces each row (currently an array of cells) with a Transaction object which stores the data for that row.
        if (!moment(line[0], "DD-MM-YYYY").isValid()) {
            throw new Error(`'${line[0]}' on line ${lineNumber} of ${filename} could not be parsed as a date.`);
            return null;
        } else if (!typeof line[1] === 'string') {
            throw new Error(`${line[1]} on line ${lineNumber} of ${filename} is not a string.`);
            return null;
        } else if (!typeof line[2] === 'string') {
            throw new Error(`${line[2]} on line ${lineNumber} of ${filename} is not a string.`);
            return null;
        } else if (Number.isNaN(+line[4])) {
            throw new Error(`'${line[4]}' on line ${lineNumber} of ${filename} is not a number.`);
            return null;
        } else {
            return new Transaction(moment(line[0], "DD-MM-YYYY"), line[1], line[2], line[3], +`${line[4]}`);
        }
    }
}

function parseCsvTransactions(data, filename) {
    const result = data.split('\r\n')
        .map(line => line.split(','))
        .slice(1)
        .map((line, index) => {
            try {
                return parseCsvTransactionLine(line, index + 2, filename);
            } catch (err) {
                logger.error(err);
                console.log(`Error: ${err.message} This transaction has not been loaded.`);
                return null;
            }
        });
    return result.filter(Boolean);
}

function loadTransactions(folderPath) {
    logger.info(`Loading transactions from ${folderPath}`);
    var allTransactions = [];
    const filenames = fs.readdirSync(folderPath);
    filenames.forEach(filename => {
        logger.info(`Loading ${folderPath}/${filename}`);
        const rawTransactions = fs.readFileSync(`./transactions/${filename}`, "utf8");
        const transactions = parseCsvTransactions(rawTransactions, filename);
        transactions.forEach(transaction => {
            allTransactions.push(transaction);
        })
    })
    logger.info('Finished loading transactions.');
    return allTransactions;
}

exports.loadTransactions = loadTransactions;