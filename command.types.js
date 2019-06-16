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
        case '>': return this.left;
        case '<': return this.right;
        case '-': return this.decrement;
        case '+': return this.increment;
        case '.': return this.read;
        case ',': return this.write;
        case '[': return this.loopStart;
        case ']': return this.loopEnd;
    }
}