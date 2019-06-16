exports.invalidSymbols = (symbols) => {
    const prettySymbols = symbols.map(({ symbol, position }) => `${symbol} at ${position}`).join(' ');
    return { code: 'INVALID_SYMBOLS', message: `Invalid symbols: ${prettySymbols}` };
}

exports.missingLoopOpening = (posiiton) => {
    return { code: 'INVALID_LOOP', message: `No loop to be closed at ${posiiton}` };
}

exports.loopNotClosed = () => {
    return { code: 'INVALID_LOOP', message: 'Loop not cosed' };
}

exports.unusedInputs = (inputs) => {
    return { code: 'INPUT_ERROR', message: `Inputs ${inputs.join(', ')} are not used` };
}

exports.unexpectedInputRequest = () => {
    return { code: 'INPUT_ERROR', message: `Requesting unexpected input` };
}