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
Date: ${this.date}
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
        //HANDLE NEW PERSONS
        if (! persons.map(elem => elem.name).includes(transaction.from)) {
            persons.push(new Person(transaction.from, transaction.amount));
        } else if (! persons.map(elem => elem.name).includes(transaction.to)) {
            persons.push(new Person(transaction.to, transaction.amount));
        } else {
            //HANDLE EXISTING PERSONS by finding person in persons array and then updating amount
            persons.forEach(person => {
                if (person.name == transaction.from) {
                    person.account -= transaction.amount
                } else if (person.name == transaction.to) {
                    person.account += transaction.amount
                }
            })
        }
    });
    return persons;
}
        
let persons = [];
const rawTransactions2014 = fs.readFileSync("./transactions2014.csv", "utf8");
const transactions2014 = parseCsvTransactions(rawTransactions2014);
const persons2014 = updatePersons(persons, transactions2014);

// Main
console.log(`============================
Welcome to the Support Bank!`);
while (true) {
    console.log(`============================
Please enter one of the following commands:

    List Transactions  [To see a list of all transactions]
    List All           [To see a list of all people and what they owe or are owed]
    List [Account]     [To see a particular person's transactions and their amount owed or owing]

or CTRL + C to close the program`);
    
    var command = readlineSync.prompt();
    
    if (command === 'List Transactions') {
        transactions2014.forEach(element => element.displayTransaction());
    } else if (command === 'List All') {
        persons2014.forEach(element => element.displayPerson());
    } else {
        const name = command.slice(5);
        const account = persons.find(person => person.name === name).account.toFixed(2);
        const requestedPersonsTransactions = transactions2014.filter(transaction => {if (transaction.from === name || transaction.to === name) {return true}});
        if (account > 0) {
            console.log(`${name} is owed ${account}`);
        } else {
            console.log(`${name} owes ${Math.abs(account)}`);
        }
        console.log(`Here are ${name}'s transactions: \n`);
        requestedPersonsTransactions.forEach(transaction => transaction.displayTransaction());
        }
}