const readlineSync = require('readline-sync');
const log4js = require('log4js');
const logger = log4js.getLogger('index');
const transactionHandler = require('./transactionHandler');
const accounts = require('./accounts');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug' }
    }
});

function importTransactions() {
    let result = {
        finished: false,
        transactions: []
    }
    do {
        console.log(`To import transaction data, please choose one of the following commands:

    Import File [path]       [To load a file of transaction files]
    Import Folder [path]     [To load a folder of transaction files]
    Default                  [To import all files from the default folder (./transactions)]`);

        const command = readlineSync.prompt().trim().toLowerCase();
        try {
            if (command.slice(0, 11) === 'import file') {
                const filePath = command.slice(12);
                result.transactions = transactionHandler.importFile(filePath, './');
            } else if (command.slice(0, 13) === 'import folder') {
                const folderPath = command.slice(14);
                result.transactions = transactionHandler.loadFolder(folderPath);
            } else if (command === 'default') {
                result.transactions = transactionHandler.loadFolder('./transactions');
            } else {
                throw new Error('Import command not recognised.');
            }
            result.finished = true;
            console.log("Finished loading transactions: "); 
            return result.transactions;
        } catch (err) {
            logger.error(err);
            console.log(err.message);
        }
    } while (result.finished === false);
}

function mainLoop(persons, transactions) {
    while (true) {
        console.log(`
Please enter one of the following commands:

    List All           [To see a list of all people and what they owe or are owed]
    List [Account]     [To see a particular person's transactions and their amount owed or owing]

or CTRL + C to close the program`);

        const command = readlineSync.prompt().trim();

        if (command === 'List All') {
            accounts.listAll(persons);
        } else if (command.slice(0, 4) === 'List') {
            try {
                accounts.listAccount(command, persons, transactions);
            } catch (err) {
                logger.error(err);
                console.log(err.message);
            }
        } else {
            console.log("\nThat command was not recognised.");
        }
    }
}

// Main
logger.info('Starting Support Bank');
console.log(`\n
Welcome to the Support Bank!
============================`);

const transactions = importTransactions();
const persons = accounts.getPersons(transactions);
mainLoop(persons, transactions);