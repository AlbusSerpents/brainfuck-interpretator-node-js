const types = require('./command.types');
const errorTypes = require('./error.types');

exports.parse = (text) => {
    const textArray = Array.from(text);
    const withPositions = positions(textArray);
    const cleanedArray = removeEmptySymbols(withPositions);
    const invalid = findInvalid(cleanedArray);

    if (!invalid || invalid.length > 0) {
        throw errorTypes.invalidSymbols(invalid);
    }


    const reversed = cleanedArray.reverse();
    const { value, inLoop } = doParse(reversed);
    const result = value;

    if (reversed && reversed.length > 0) {
        const errorPosition = result[0].position - 1;
        throw errorTypes.missingLoopOpening(errorPosition);
    } else if (inLoop) {
        throw errorTypes.loopNotClosed();
    } else {
        return result;
    }
}

function positions(textArray) {
    const length = textArray.length;
    const positions = [...Array(length).keys()];

    return positions.map(position => { return { symbol: textArray[position], position: position + 1 } });
}

function removeEmptySymbols(textArray) {
    return textArray.filter(({ symbol }) => symbol && symbol !== '' && symbol !== ' ' && symbol !== '\n' && symbol !== '\r')
}

function findInvalid(textArray) {
    return textArray.filter(({ symbol }) => !types.allowedSymbols.includes(symbol));
}

function doParse(textArr, inLoop) {
    if (!textArr || textArr.length === 0) {
        return { value: [], inLoop: false };
    }
    const current = textArr.pop();
    const commandType = types.fromSymbol(current.symbol);
    if (commandType === types.loopEnd) {
        return { value: [], inLoop: true };
    } else if (commandType === types.loopStart) {
        const result = doParse(textArr);
        const node = { name: types.loop, children: result.value };
        const rest = doParse(textArr);
        return { value: [node, ...rest.value], inLoop: false };
    } else {
        const node = { name: commandType };
        const rest = doParse(textArr);
        return { value: [node, ...rest.value], inLoop };
    }
}
