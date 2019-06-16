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
        case 'Left': {
            const newValue = moveLeft(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case 'Right': {
            const newValue = moveRight(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case 'Increment': {
            const newValue = increment(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case 'Decrement': {
            const newValue = decrement(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case 'Write': {
            const newValue = write(value, command.value);
            history.push({ tape: newValue, currentCommand: `${command.name} ${command.value}` });
            return { value: newValue, history };
        }
        case 'Read': {
            const newValue = read(value);
            history.push({ tape: newValue, currentCommand: command.name });
            return { value: newValue, history };
        }
        case 'Loop': {
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

    const loopStarted = { currentCommand: 'Loop Start' };
    const loopEnded = { currentCommand: `Loop End ${currentHead}` }

    const fullHistory = [...history, loopStarted, ...loopResult.history, loopEnded];
    const newState = { value: loopResult.value, history: fullHistory };

    return currentHead === 0 ? newState : executeCommand(newState, command);
}

exports.allCommands = () => {
    return [
        { name: 'Right' },
        { name: 'Right' },
        { name: 'Increment' },
        { name: 'Read' },
        { name: 'Write', value: 3 },
        { name: 'Left' },
        { name: 'Decrement' },
        { name: 'Decrement' },
        {
            name: 'Loop',
            children: [
                { name: 'Right' },
                { name: 'Right' },
                { name: 'Increment' },
                { name: 'Read' },
                { name: 'Left' },
                { name: 'Read' },
                { name: 'Increment' },
                { name: 'Left' },
                { name: 'Increment' }
            ]
        }
    ];
}

function printState({ left, current, right, output }) {
    return `${left.join(' ')} [${current}] ${right.join(' ')} | "${output}" `;
}

function printHistory({ tape, currentCommand }) {
    return tape ? `${printState(tape)} | ${currentCommand}` : `${currentCommand}`;
}

exports.prettyPrint = ({ value, history }) => {
    const printedHistory = history.map(printHistory).join('\r\n');
    return `${printState(value)} \r\n\r\n${printedHistory}`;
}

exports.doStuff = () => {
    const parsed = this.execute(this.allCommands());
    const res = this.prettyPrint(parsed);
    console.log(res);
}