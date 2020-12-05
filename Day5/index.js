'use strict';

const fs = require('fs/promises');

function decodeSeat(seat) {
    // First integer - the start of the range,
    // Second integer - length of that range
    let rowRange = [0, 128], colRange = [0, 8];
    for (const N of seat) {
        switch (N) {
            case 'B':
                rowRange[1] /= 2;
                rowRange[0] += rowRange[1];
                break;
            case 'F':
                rowRange[1] /= 2;
                break;
            case 'R':
                colRange[1] /= 2;
                colRange[0] += colRange[1];
                break;
            case 'L':
                colRange[1] /= 2;
                break;
        }
    }
    let row = rowRange[0];
    let col = colRange[0];
    let seatID = (row * 8) + col;
    return { row, col, seatID };
}

function searchSeat(seatIDs) {
    seatIDs.sort();
    let lastID = seatIDs[0];
    for (const id of seatIDs) {
        if (lastID === id - 2) return id - 1;
        lastID = id;
    }
}

const readFileCallback = file => {
    let seats = file.toString().split('\n');
    let highestID = 0;
    let seatIDs = [];
    seats.forEach(seat => {
        let { seatID } = decodeSeat(seat);
        if ( seatID > highestID ) highestID = seatID;
        seatIDs.push(seatID);
    });
    console.log('Your seat ID is:', searchSeat(seatIDs));
    console.log('Highest seat ID is:', highestID);
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day5/input.txt').then(readFileCallback).catch(console.error);
});