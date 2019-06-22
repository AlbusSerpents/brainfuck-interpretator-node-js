const parser = require('./parser');
const commands = require('./commands');

exports.handler = async (event) => {
    const code = event.code;
    const input = Array.from(event.input);
    try {
        const codeCommands = parser.parse(code);
        const result = commands.execute(codeCommands, input);
        return JSON.stringify(result);
    } catch (error) {
        const errorResponse = { code: error.code, message: error.message };
        return JSON.stringify(errorResponse);
    }
};