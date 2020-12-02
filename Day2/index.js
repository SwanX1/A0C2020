'use strict';

const fs = require("fs/promises");

let passwordValidationType = process.argv[2] === 'old' ? 0 : 1;

class PasswordRule {
    constructor(rule, type) {
        this.rule = rule.split(/[\- ]/g);
        this.type = type;
    }
    
    get min() {
        return Number(this.rule[0]);
    }

    get max() {
        return Number(this.rule[1]);
    }

    get char() {
        return this.rule[2];
    }

    validate(password) {
        if (this.type === 0) {
            let charCount = 0;
            let splitPassword = password.split('');
            for (const char of splitPassword) {
                if (char === this.char) {
                    charCount++;
                }
            }
            return !(charCount > this.max || charCount < this.min);
        }
        else if (this.type === 1) {
            let char1 = password[this.min - 1];
            let char2 = password[this.max - 1];
            return char1 !== char2 && (char1 === this.char || char2 === this.char);
        }
    }
}
class PasswordInstance {
    constructor(rule, value) {
        this.rule = rule;
        this.value = value;
    }

    validatePassword() {
        return this.rule.validate(this.value);
    }

    get valid() {
        return this.validatePassword();
    }
}

function parseStringToPassword(input) {
    // Example: "12-14 j: mjtmzfjjtsgvgtq"
    let splitInput = input.split(': ');
    return new PasswordInstance(new PasswordRule(splitInput[0], passwordValidationType), splitInput[1]);
}

const readFileCallback = file => {
    let PasswordsAndRules = file.toString().split('\n');
    PasswordsAndRules.forEach(pnr => {
        if (parseStringToPassword(pnr).valid) validCount++;
    });

    console.log('Valid passwords:', validCount);
    
};
let validCount = 0;
fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day2/input.txt').then(readFileCallback).catch(console.error);
});