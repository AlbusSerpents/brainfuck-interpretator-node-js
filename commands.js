const types = require('./command.types');

exports.execute = (commands) => {
    const initialValue = { left: [], current: 0, right: [], output: '' };
    const emptyTape = { value: initialValue, history: [{ tape: initialValue, currentCommand: null }] };
    if (!commands || commands.length == 0) {
        return emptyTape;
    } else {
        return executeAll(commands, emptyTape);
    }
}

function executeAll(commands, tape) {
    return commands.reduce(executeCommand, tape);
}

function executeCommand({ value, history }, command) {
    switch (command.name) {
        case types.left: {
            const newValue = moveLeft(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case types.right: {
            const newValue = moveRight(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case types.increment: {
            const newValue = increment(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case types.decrement: {
            const newValue = decrement(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case types.write: {
            const newValue = write(value, command.value);
            history.push({ tape: newValue, currentCommand: `${command.name} ${command.value}` });
            return { value: newValue, history };
        }
        case types.read: {
            const newValue = read(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case types.loop: {
            return loop({ value, history }, command);
        }
    }
}

function moveLeft({ left = [], current, right, output }) {
    const newLeft = [...left];
    const newRight = [...right];
    const newCurrent = newLeft.pop();
    newRight.unshift(current);
    return { left: newLeft, current: newCurrent ? newCurrent : 0, right: newRight, output };
}

function moveRight({ left, current, right = [], output }) {
    const newLeft = [...left];
    const [newCurrent, ...newRight] = [...right];
    newLeft.push(current);
    return { left: newLeft, current: newCurrent ? newCurrent : 0, right: newRight, output };
}

function increment({ left, current, right, output }) {
    return { left, current: current === 255 ? 0 : current + 1, right, output };
}

function decrement({ left, current, right, output }) {
    return { left, current: current === 0 ? 255 : current - 1, right, output };
}

function write({ left, right, output }, newValue) {
    return { left, current: newValue, right, output };
}

function read({ left, current, right, output }) {
    const newOutput = output + current;
    return { left, current, right, output: newOutput };
}

function loop({ value, history = [] }, command) {
    const loopResult = executeAll(command.children, { value, history: [] });
    const currentHead = loopResult.value.current;

    const loopStarted = { currentCommand: types.loopStart };
    const loopEnded = { currentCommand: `${types.loopEnd} ${currentHead}` }

    const fullHistory = [...history, loopStarted, ...loopResult.history, loopEnded];
    const newState = { value: loopResult.value, history: fullHistory };

    return currentHead === 0 ? newState : executeCommand(newState, command);
}
