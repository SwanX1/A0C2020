'use strict';

const fs = require('fs/promises');

function checkValid(preamble, number) {
    for (const number1 of preamble) {
        for (const number2 of preamble) {
            if (number1 === number2) continue;
            if (number1 + number2 === number) return true;
        }
    }
    return false;
}

function sum(...numbers) {
    let i = 0;
    for (const num of numbers) {
        i += num;
    }
    return i;
}

function checkSum(number, ...numbers) {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (sum(...numbers.slice(i,j)) === number) {
                debugger;
                return numbers.slice(i,j);
            }
        }
    }
    return null;
}

const readFileCallback = file => {
    const numbersOrig = file.toString().split('\n').map(e => Number(e));
    let numbers = Array.from(numbersOrig);
    let preamble = [];
    const preambleLength = 25;
    do {
        preamble.shift();
        while (preamble.length < preambleLength) {
            preamble.push(numbers.shift());
        }
    } while (checkValid(preamble, numbers[0]));
    console.log('First number to violate this rule:', numbers[0]);
    let contiguous = checkSum(numbers[0], ...numbersOrig);
    let minContiguous = Math.min(...contiguous);
    let maxContiguous = Math.max(...contiguous);
    console.log('Encryption weakness:', minContiguous + maxContiguous);
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day8/input.txt').then(readFileCallback).catch(console.error);
});