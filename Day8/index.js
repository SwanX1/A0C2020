'use strict';

const fs = require('fs/promises');

function executeOperations(operations) {
    let completedOperations = [];
    let counter = 0;
    let opHead = 0;
    while (!completedOperations.includes(opHead)) {
        completedOperations.push(opHead);
        if (typeof operations[opHead] === 'undefined') return {complete: true, counter, line: opHead + 1};
        let [operationName, argument] = operations[opHead].split(' ');
        switch (operationName) {
            case 'acc':
                counter += Number(argument);
                opHead++;
                break;
            case 'jmp':
                opHead += Number(argument);
                break;
            case 'nop':
                opHead++;
                break;
        }
    }
    return {complete: false, counter, line: opHead + 1};
}

const readFileCallback = file => {
    let operations = file.toString().split('\n');
    if (process.argv.includes('--old')) {
        const { counter, line } = executeOperations(operations);
        console.log(`Operation terminated:\nat line ${line},\nwith counter ${counter}`);
    } else {
        const { line: endOperation } = executeOperations(operations);
        for (let operation = 0; operation < operations.length; operation++) {
            if (operation === endOperation) {
                console.log('Found no exit points.');
                break;
            }
            if (!operations[operation].startsWith('jmp') && !operations[operation].startsWith('nop')) continue;
            let copyOperation = Array.from(operations);
            let splitOperation = operations[operation].split(' ');
            splitOperation[0] = splitOperation[0] === 'jmp' ? 'nop' : 'jmp';
            copyOperation[operation] = splitOperation.join(' ');
            const { complete, counter, line } = executeOperations(copyOperation);
            if (complete) {
                console.log(`Line flip ${operation + 1} works, with termination.\nCounter: ${counter}`);
                break;
            }
        }
    }
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day8/input.txt').then(readFileCallback).catch(console.error);
});