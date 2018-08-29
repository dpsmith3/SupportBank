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

function mainLoop(persons, transactions) {
    while (true) {
        console.log(`
Please enter one of the following commands:

    List All           [To see a list of all people and what they owe or are owed]
    List [Account]     [To see a particular person's transactions and their amount owed or owing]

or CTRL + C to close the program`);

        const command = readlineSync.prompt();

        if (command === 'List All') {
            accounts.listAll(persons);
        } else if (command.slice(0, 4) === 'List') {
            accounts.listAccount(command, persons, transactions);
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

const transactions = transactionHandler.loadFolder('./transactions');
const persons = accounts.getPersons(transactions);
mainLoop(persons, transactions);