'use strict';

const fs = require('fs/promises');

fs.readFile('input.txt').then(file => {
    const numbers = file.toString().split('\n').map(Number);
    if (process.argv[2] === 'old') {
        for (const [ a, b ] of findFactorsOf2020Old(numbers)) {
            console.log(`a = ${a}\nb = ${b}\na + b = 2020\na * b = ${ a * b }\n`);
        }
    } else {
        for (const [ a, b, c ] of findFactorsOf2020(numbers)) {
            console.log(`a = ${a}\nb = ${b}\nc = ${c}\na + b + c = 2020\na * b * c = ${ a * b * c }\n`);
        }
    }
}).catch(console.error);

function findFactorsOf2020Old(numberArray) {
    const factors = [];
    for (const num1 of numberArray) {
        for (const num2 of numberArray) {
            if (num1 + num2 === 2020) {
                factors.push([num1, num2]);
            }
        }
    }
    return factors;
}

function findFactorsOf2020(numberArray) {
    const factors = [];
    for (const num1 of numberArray) {
        for (const num2 of numberArray) {
            for (const num3 of numberArray) {
                if (num1 + num2 + num3 === 2020) {
                    factors.push([num1, num2, num3]);
                }
            }
        }
    }
    return factors;
}