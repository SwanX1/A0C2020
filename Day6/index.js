'use strict';

const fs = require('fs/promises');

function countEntries(array, search) {
    let counter = 0;
    for (const item of array) {
        if (search === item) {
            counter++;
        }
    }
    return counter;
}

function getUnique(array) {
    let unique = [];
    for (const item of array) {
        if (!unique.find(e => e === item)) {
            unique.push(item);
        }
    }
    return unique;
}

const readFileCallback = file => {
    let groups = file.toString().split('\n\n');
    let groupAnswers = [];
    groups.forEach(group => {
        let answers = [];
        group.split('\n').forEach(person => {
            person.split('').forEach(answer => {
                if (!answers.find(e => e === answer) && process.argv.includes('--old')) {
                    answers.push(answer);
                } else if (!process.argv.includes('--old')) {
                    answers.push(answer);
                }
            });
        });
        if (process.argv.includes('--old')) {
            groupAnswers.push(answers);
        } else {
            let people = group.split('\n').length;
            let count = 0;
            for (const answer of getUnique(answers)) {
                if (countEntries(answers, answer) === people) {
                    count++;
                }
            }
            groupAnswers.push(count);
        }
    });
    let totalAnswerSum = 0;
    if (process.argv.includes('--old')) {
        groupAnswers.forEach(e => totalAnswerSum += e.length);
    } else {
        groupAnswers.forEach(e => totalAnswerSum += e);
    }
    console.log('All answers of groups tallied up:', totalAnswerSum);
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day5/input.txt').then(readFileCallback).catch(console.error);
});