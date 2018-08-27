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
    try {
        const result = data.split('\r\n')
            .map(x => x.split(','))
            .slice(1)
            .map((x, index) => {
                if (!moment(x[0], "DD-MM-YYYY").isValid()) {
                    throw new Error(`'${x[0]}' on line ${index + 2} of CSV file could not be parsed as a date`);
                } else if (!typeof x[1] === 'string') {
                    throw new Error(`${x[1]} on line ${index + 2} of CSV file is not a string`);
                } else if (!typeof x[2] === 'string') {
                    throw new Error(`${x[2]} on line ${index + 2} of CSV file is not a string`);
                } else if (Number.isNaN(+x[4])) {
                    throw new Error(`'${x[4]}' on line ${index + 2} of CSV file is not a number`);
                } else {
                    return new Transaction(moment(x[0], "DD-MM-YYYY"), x[1], x[2], x[3], +`${x[4]}`);
                }
            });
        return result;
    } catch (err) {
        logger.error(err);
    }
}

function loadTransactions(folderPath) {
    logger.info(`Loading transactions from ${folderPath}`);
    try {
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
        logger.info('All transactions loaded successfully');
        return allTransactions;
    } catch (err) {
        logger.error("Error caught in loadTransactions function: ", err);
    }

}

exports.loadTransactions = loadTransactions;