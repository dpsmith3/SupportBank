const readlineSync = require('readline-sync');
const moment = require('moment');
const fs = require('fs');

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
    return data.split('\r\n')
        .map(x => x.split(','))
        .slice(1).map(x => new Transaction(moment(x[0], "DD-MM-YYYY"), x[1], x[2], x[3], +`${x[4]}`)
        )
}

function updatePersons(persons, transactions) {
    transactions.forEach(transaction => {
        // Handle new persons
        if (!persons.map(elem => elem.name).includes(transaction.from)) {
            persons.push(new Person(transaction.from, - transaction.amount));
        } else if (!persons.map(elem => elem.name).includes(transaction.to)) {
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

// Main
let persons = [];
const rawTransactions2014 = fs.readFileSync("./transactions2014.csv", "utf8");
const transactions = parseCsvTransactions(rawTransactions2014);
persons = updatePersons(persons, transactions);

console.log(`\n
Welcome to the Support Bank!
============================`);

while (true) {
    console.log(`
Please enter one of the following commands:

    List All           [To see a list of all people and what they owe or are owed]
    List [Account]     [To see a particular person's transactions and their amount owed or owing]

or CTRL + C to close the program`);

    const command = readlineSync.prompt();

    if (command === 'List All') {
        listAll(persons);
    } else if (command.slice(0,4) === 'List') {
        listAccount(command, persons, transactions);
    } else {
        console.log("\nThat command was not recognised.");
    }
}