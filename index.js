const readlineSync = require('readline-sync');
const moment = require('moment');
const fs = require('fs');


class Person {
    constructor(name, account, transactions) {
        this.name = name;
        this.account = account;
        this.transactions = transactions;
    }

    displayPerson() {
        result = 
        `Name: ${this.name}
        Account: ${this.account}`;
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

const rawTransactions2014 = fs.readFileSync("./transactions2014.csv", "utf8");
const transactions2014 = parseCsvTransactions(rawTransactions2014);

//Main

console.log(`Welcome to the support bank!
Please enter one of the following commands:
  List Transactions  [To see a list of all transactions]
  List All           [To see a list of all people and what they owe or are owed]`);

var command = readlineSync.prompt();

if (command == 'List Transactions') {
    transactions2014.forEach(element => element.displayTransaction());
}