const log4js = require('log4js');
const logger = log4js.getLogger('accounts.js');

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
        const fromPersonIndex = persons.findIndex(person => person.name === transaction.from);
        if (fromPersonIndex >= 0) {
            persons[fromPersonIndex].account -= transaction.amount;
        } else {
            persons.push(new Person(transaction.from, -transaction.amount));
        }

        const toPersonIndex = persons.findIndex(person => person.name === transaction.to);
        if (toPersonIndex >= 0) {
            persons[toPersonIndex].account += transaction.amount;
        } else {
            persons.push(new Person(transaction.to, transaction.amount));
        }
    });
    return persons;
}

function listAll(persons) {
    logger.info('Listing all accounts')
    persons.forEach(element => element.displayPerson());
}

function listAccount(command, persons, transactions) {
    const requestedName = command.slice(5);
    logger.info(`Listing ${requestedName}'s account.`);
    let requestedAccount;
    try {
        requestedAccount = persons.find(person => person.name === requestedName).account.toFixed(2);
    } catch (err) {
        logger.error(err);
        throw new Error('Requested account not found');
    }
    const requestedTransactions = transactions.filter(transaction => (
        transaction.from === requestedName || transaction.to === requestedName
    ));

    if (requestedAccount > 0) {
        console.log(`\n${requestedName} is owed ${requestedAccount}`);
    } else {
        console.log(`\n${requestedName} owes ${Math.abs(requestedAccount)}`);
    }
    console.log(`\nHere are ${requestedName}'s transactions:`);
    requestedTransactions.forEach(transaction => transaction.displayTransaction());
}

module.exports = {
    getPersons : getPersons,
    listAccount : listAccount,
    listAll : listAll
}