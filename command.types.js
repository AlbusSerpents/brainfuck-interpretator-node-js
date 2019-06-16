exports.left = 'LEFT';
exports.right = 'RIGHT';
exports.increment = 'INCREMENT';
exports.decrement = 'DECREMENT';
exports.read = 'READ';
exports.write = 'WRITE';
exports.loop = 'LOOP';
exports.loopStart = 'LOOP_START';
exports.loopEnd = 'LOOP_END';
exports.allowedSymbols = '<>-+,.[]';

exports.fromSymbol = (symbol) => {
    switch (symbol) {
        case '>': return this.right;
        case '<': return this.left;
        case '-': return this.decrement;
        case '+': return this.increment;
        case '.': return this.read;
        case ',': return this.write;
        case '[': return this.loopStart;
        case ']': return this.loopEnd;
    }
}

exports.fromName = (name) => {
    switch (name) {
        case this.left: return '<';
        case this.right: return '>';
        case this.increment: return '+';
        case this.decrement: return '-';
        case this.read: return '.';
        case this.write: return ',';
        case this.loopStart: return '[';
        case this.loopEnd: return ']';
    }
}