'use strict';

const fs = require('fs/promises');

const requiredFields = ['byr','iyr','eyr','hgt','hcl','ecl','pid'];
const fieldValidation = {
    'byr': /^(19[2-9]\d)|(200[0-2])$/,
    'iyr': /^20((1\d)|20)$/,
    'eyr': /^20((2\d)|30)$/,
    'hgt': /^((1(([5-8]\d)|(9[0-3]))cm)|((59)|(6\d)|(7[0-6]))in)$/,
    'hcl': /^\#[\da-f]{6}$/,
    'ecl': /^(amb|blu|brn|gry|grn|hzl|oth)$/,
    'pid': /^\d{9}$/
};

class Passport {
    constructor(passportString) {
        this.fields = {};
        passportString.split(/[\n\ ]/g).forEach(field => {
            let [key, value] = field.split(':');
            this.fields[key] = value;
        });
    }

    isValid(validationType) {
        for (const requiredField of requiredFields) {
            if (
                validationType ?
                typeof this.fields[requiredField] === 'undefined' :
                !fieldValidation[requiredField].exec(this.fields[requiredField])
            ) return false;
        }
        return true;
    }
}

const readFileCallback = file => {
    let validPassports = 0;
    file.toString().split('\n\n').forEach(passportString => {
        if (new Passport(passportString).isValid(process.argv.includes('--old'))) validPassports++;
    });
    console.log('Valid Passports:', validPassports);
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day4/input.txt').then(readFileCallback).catch(console.error);
});