const path = require('path');
const fs = require('fs');
const solc = require('solc');

const helloPath = path.resolve(__dirname, 'contracts', 'Hello.sol');
const source = fs.readFileSync(helloPath, 'UTF-8');

const input = {
    language: "Solidity",
    sources: {
        "Hello.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))); 
exports.abi = output.contracts['Hello.sol']['Hello'].abi;
exports.bytecode = output.contracts['Hello.sol']['Hello'].evm.bytecode.object;