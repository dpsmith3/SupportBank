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

function parseCsvTransactions(data) {
    const result = data.split('\r\n')
        .map(x => x.split(','))
        .slice(1).map((x, index) => {
            let transaction = new Transaction();
            transaction.date = moment(x[0], "DD-MM-YYYY");
            if (!moment(transaction.date).isValid()) {
                logger.error(`'${x[0]}' on line ${index + 2} of CSV file could not be parsed as a date`);
            }
            transaction.from = x[1];
            transaction.to = x[2];
            transaction.narrative = x[3];
            transaction.amount = +`${x[4]}`;
            if (Number.isNaN(+x[4])) {
                logger.error(`'${x[4]}' on line ${index + 2} of CSV file is not a number`);
            }
            return transaction;
        });
    return result;
}

function loadTransactions(folderPath) {
    logger.info(`Loading transactions from ${folderPath}`);
    var allTransactions = [];
    const filenames = fs.readdirSync(folderPath);
    filenames.forEach(filename => {
        logger.info(`Loading ${folderPath}/${filename}`);
        const rawTransactions = fs.readFileSync(`./transactions/${filename}`, "utf8");
        const transactions = parseCsvTransactions(rawTransactions);
        transactions.forEach(transaction => {
            allTransactions.push(transaction);
        })
    })
    return allTransactions;
    ;
}

exports.loadTransactions = loadTransactions;