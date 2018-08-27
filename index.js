const readlineSync = require('readline-sync');
const moment = require('moment');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('index');
const loadCsvData = require('./loadCsvData.js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug' }
    }
});

class Person {
    constructor(name, account) {
        this.name = name;
        this.account = account;
    }

    displayPerson() {
        const result = `
Name: ${this.name}
Account: ${this.account.toFixed(2)}`;
        console.log(result);
    }
}

function getPersons(transactions) {
    const persons = [];
    transactions.forEach(transaction => {
        // Handle new persons
        if (!persons.map(person => person.name).includes(transaction.from)) {
            persons.push(new Person(transaction.from, - transaction.amount));
        } else if (!persons.map(person => person.name).includes(transaction.to)) {
            persons.push(new Person(transaction.to, transaction.amount));
        } else {
            //Handle existing persons
            persons.forEach(person => {
                if (person.name === transaction.from) {
                    person.account -= transaction.amount
                } else if (person.name === transaction.to) {
                    person.account += transaction.amount
                }
            })
        }
    });
    return persons;
}

function listAll(persons) {
    persons.forEach(element => element.displayPerson());
}

function listAccount(command, persons, transactions) {
    const requestedName = command.slice(5);
    const requestedAccount = persons.find(person => person.name === requestedName).account.toFixed(2);
    const requestedTransactions = transactions.filter(transaction => {
        if (transaction.from === requestedName || transaction.to === requestedName) {
            return true;
        }
    });

    if (requestedAccount > 0) {
        console.log(`\n${requestedName} is owed ${requestedAccount}`);
    } else {
        console.log(`\n${requestedName} owes ${Math.abs(requestedAccount)}`);
    }
    console.log(`Here are ${requestedName}'s transactions:`);
    requestedTransactions.forEach(transaction => transaction.displayTransaction());
}

function mainLoop(persons, transactions) {
    while (true) {
        console.log(`
    Please enter one of the following commands:
    
        List All           [To see a list of all people and what they owe or are owed]
        List [Account]     [To see a particular person's transactions and their amount owed or owing]
    
    or CTRL + C to close the program`);

        const command = readlineSync.prompt();

        if (command === 'List All') {
            listAll(persons);
        } else if (command.slice(0, 4) === 'List') {
            listAccount(command, persons, transactions);
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

try {
    const transactions = loadCsvData.loadTransactions('./transactions');
    const persons = getPersons(transactions);
    mainLoop(persons, transactions);
} catch (err) {
    logger.error(err);
    console.log("Error loading transaction data. See log for more information.");
}