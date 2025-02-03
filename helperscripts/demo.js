'use strict';
function getTimestampPrefix() {
    return 'tmp' + (Date.now() % 10000)
}

function createVariables(code) {
    const prefix = getTimestampPrefix();
    const regex = /(?:var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    const variables = [...code.matchAll(regex)].map(match => match[1]);
    
    variables.forEach(v => {
        globalThis[prefix + v] = undefined;
    });
    
    const cleanup = () => {
        variables.forEach(v => {
            delete globalThis[prefix + v];
        });
    };
    
    return { variables: variables.map(v => prefix + v), prefix, cleanup };
}

function executeCode(code, prefix) {
    const cleanCode = code
        .replace(/(?:var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, (_, v) => `${prefix}${v} =`)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?!\s*=)/g, (match, v) => {
            return Object.prototype.hasOwnProperty.call(globalThis, prefix + v) ? prefix + v : match;
        });
    
    return eval(cleanCode);
}

// Example usage:
const code = `
    var tmp = 123;
    var tmp_hi = tmp + 1;
    var tmp_low = tmp_hi + 1;
    tmp_low; // Return value
`;

const { variables, prefix, cleanup } = createVariables(code);
const result = executeCode(code, prefix);
console.log(result); // 125
console.log(globalThis[variables[0]]); // 123
cleanup(); // Remove all created variables
console.log(globalThis[variables[0]]); // undefined