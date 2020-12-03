'use strict';

const fs = require("fs/promises");

class Pointer {
    constructor(x, y, max) {
        this.x = x;
        this.y = y;
        this.max = max;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
        if (this.x > this.max) {
            this.x = this.x % this.max - 1;
        }
    }
}

class TreeMap {
    constructor(input) {
        this.area = input.split('\n').map(e => e.split(''));
        this.pointer = new Pointer(0, 0, this.area[0].length - 1);
    }

    checkTree() {
        return this.area[this.pointer.y][this.pointer.x] === '#';
    }

    checkLine(incX, incY) {
        let treeCount = 0;
        do {
            if (this.checkTree()) treeCount++;
            if (process.argv[4] === '--debug') {
                console.log({
                    x: this.pointer.x,
                    y: this.pointer.y,
                    tree: this.area[this.pointer.y][this.pointer.x]
                });
            }
            this.pointer.move(incX, incY);
        } while (this.area.length > this.pointer.y);
        return treeCount;
    }
}

const readFileCallback = file => {
    let treemap = new TreeMap(file.toString());
    console.log(treemap.checkLine(Number(process.argv[2]), Number(process.argv[3])));
};

fs.lstat('input.txt').then(() => {
    fs.readFile('input.txt').then(readFileCallback).catch(console.error);
}).catch(() => {
    fs.readFile('Day3/input.txt').then(readFileCallback).catch(console.error);
});