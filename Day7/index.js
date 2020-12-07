'use strict';

const fs = require('fs/promises');

const areArraysEqual = (array1, array2) => JSON.stringify(array1) === JSON.stringify(array2);

function countBagsOld(rules, bagColor) {
    let containsBagColor = [];
    let prevContainsBagColor;
    do {
        prevContainsBagColor = Array.from(containsBagColor);
        for (const color in rules) {
            if (rules.hasOwnProperty(color)) {
                for (const containsColor of rules[color]) {
                    if ((containsColor === bagColor || containsBagColor.includes(containsColor)) && !containsBagColor.includes(color)) {
                        containsBagColor.push(color);
                    }
                }
            }
        }
    } while (!areArraysEqual(containsBagColor, prevContainsBagColor));
    debugger;
    return containsBagColor.length;
}

function countBags(rules, bagColor) {
    let totalBags = 0;
    for (const insideBag of rules[bagColor]) {
        totalBags += insideBag.count;
        totalBags += countBags(rules, insideBag.color) * insideBag.count;
    }
    return totalBags;
}

const readFileCallback = file => {
    let rules = {};
    const inputLines = file.toString().split('\n');
    for (const inputLine of inputLines) {
        let split;
        split = inputLine.split(' bags contain ');
        const color = split[0];
        rules[color] = [];
        if (split[1] === 'no other bags.') continue;
        split = split[1].split(', ');
        for (const contains of split) {
            const containsColor = contains.split(/ bags?/)[0].substr(2);
            if (process.argv.includes('--old')) {
                rules[color].push(containsColor);
            } else {
                rules[color].push({color: containsColor, count: Number(contains.split(/ bags?/)[0].substr(0,2))});
            }
        }
    }
    if (process.argv.includes('--old')) {
        console.log('The shiny gold bag is found in', countBagsOld(rules, 'shiny gold'), 'bags.');
    } else {
        console.log('The shiny gold bag contains', countBags(rules, 'shiny gold'), 'bags.');
    }
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day5/input.txt').then(readFileCallback).catch(console.error);
});