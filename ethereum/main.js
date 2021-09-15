const Web3 = require("web3");
const ethNetwork = 'http://127.0.0.1:8545';
//const ethNetwork = 'https://ropsten.infura.io/v3/2a56678b83644ec49ecbf27187fb8f43';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

// Shows if Ethereum network is connected or not
try {    
        console.log("Connection Successfull!");
}
catch(e) {
        console.log("Connection Error!", e);
}

// Class to return the data of the Ether transactions received from the user query
class Data {
    constructor(totalBlocksEther, toAddressHashmap, fromAddressHashmap, 
        toContractAddressHashmap, fromContractAddressHashmap, totalUncles, 
        totalCreatedContracts, contractTransactionCount, totalTransactionCount,
        contractTransactionPercentage, uniqueToAddressesCount, uniqueFromAddressesCount) {

        this.totalBlocksEther = totalBlocksEther;
        this.toAddressHashmap = toAddressHashmap;
        this.fromAddressHashmap = fromAddressHashmap;
        this.toContractAddressHashmap = toContractAddressHashmap;
        this.fromContractAddressHashmap = fromContractAddressHashmap;
        this.totalUncles = totalUncles;
        this.totalCreatedContracts = totalCreatedContracts;
        this.contractTransactionCount = contractTransactionCount;
        this.totalTransactionCount = totalTransactionCount;
        this.contractTransactionPercentage = contractTransactionPercentage;
        this.uniqueToAddressesCount = uniqueToAddressesCount;
        this.uniqueFromAddressesCount = uniqueFromAddressesCount;
    }
}

// Function which takes a single number representing how far back from the present block the query should operate
async function singleInputGetTransactionData(number) {
    var fromBlock = 0;
    var toBlock = 0;
    await web3.eth.getBlockNumber(function(err, result) {
        toBlock = result;
        fromBlock = result - number;
    });
    var data = await twoInputGetTransactionData(fromBlock, toBlock);
    return data;
}

// Function which takes two numbers defining the start and end block numbers (inclusive) as a range over which the query should operate
async function twoInputGetTransactionData(fromBlock, toBlock) {
    var promises = await getTransactionData(fromBlock, toBlock);
    var totalBlocksEther = 0.0;
    var toAddressHashmap = new Map();
    var fromAddressHashmap = new Map();
    var toContractAddressHashmap = new Map();
    var fromContractAddressHashmap = new Map();
    var totalUncles = 0;
    var totalCreatedContracts = 0;
    var contractTransactionCount = 0;
    var totalTransactionCount = 0;
    var contractTransactionPercentage = 0.0;
    var uniqueToAddressesCount = 0;
    var uniqueFromAddressesCount = 0; 
    const values = await Promise.allSettled(promises);

    values.forEach(element => {
        totalBlocksEther += parseFloat(element.value.totalBlocksEther);
        toAddressHashmap = element.value.toAddressHashmap;
        fromAddressHashmap = element.value.fromAddressHashmap;
        toContractAddressHashmap = element.value.toContractAddressHashmap;
        fromContractAddressHashmap = element.value.fromContractAddressHashmap;
        totalUncles = element.value.totalUncles;
        totalCreatedContracts += element.value.totalCreatedContracts;
        contractTransactionCount += element.value.contractTransactionCount;
        totalTransactionCount += element.value.totalTransactionCount;
    });
    contractTransactionPercentage = (contractTransactionCount / totalTransactionCount) * 100;
    uniqueToAddressesCount = toAddressHashmap.size;
    uniqueFromAddressesCount = fromAddressHashmap.size;

    let data = new Data(totalBlocksEther, toAddressHashmap, fromAddressHashmap, 
        toContractAddressHashmap, fromContractAddressHashmap, totalUncles, 
        totalCreatedContracts, contractTransactionCount, totalTransactionCount, contractTransactionPercentage,
        uniqueToAddressesCount, uniqueFromAddressesCount);
    return data;
}

// Function to get transaction data of all the blocks to be traversed
async function getTransactionData(fromBlock, toBlock) {
    var i = 0;
    var totalUncles = 0;
    var toAddressHashmap = new Map();
    var fromAddressHashmap = new Map();
    var toContractAddressHashmap = new Map();
    var fromContractAddressHashmap = new Map();
    var promises = [];
    for(i = fromBlock; i <= toBlock; i++) {
        await web3.eth.getBlock(i, function(err, result) {
            var unclesArray = result['uncles'];
            totalUncles += unclesArray.length;
            var transactionArray = result['transactions'];
            promises.push(getAllTransactions(transactionArray, toAddressHashmap, fromAddressHashmap, 
                toContractAddressHashmap, fromContractAddressHashmap, totalUncles));
        });
    }
    return promises;
}

// Function to check if an ethereum address is a contract address or an externally owned account address
async function checkContractAddress(address, total) {
    var contractAddressHashmap = new Map();
    await web3.eth.getCode(address, function(err, result) {
        if(result.length > 2) {
            contractAddressHashmap.set(address, total);
        }
    });
    return contractAddressHashmap;
}

// Function to get the transaction data from transaction hash array of the blocks
async function getAllTransactions(transactionHashArray, toAddressHashmap, fromAddressHashmap, 
    toContractAddressHashmap, fromContractAddressHashmap, totalUncles) {
    var totalEther = 0.0;
    var i = 0;
    var totalCreatedContracts = 0;
    var contractTransactionCount = 0;
    var totalTransactionCount = 0;
    totalTransactionCount += transactionHashArray.length;
    for(i = 0; i < transactionHashArray.length; i++) {
        var promises1 = [];
        var promises2 = [];
        await web3.eth.getTransaction(transactionHashArray[i], function(err, result) {
            // Ether transferred per transaction
            var etherValue = parseFloat(result['value']);
            totalEther = etherValue + totalEther;

            // Get addresses which received ether
            var toAddress = result['to'];
            var toTotal = parseFloat(web3.utils.fromWei(etherValue.toString(), 'ether'));
            if(toAddressHashmap.has(toAddress)) {
                toTotal += toAddressHashmap.get(toAddress);
            }
            if(toTotal != 0 && toAddress != null) {
                toAddressHashmap.set(toAddress, toTotal);
                promises1.push(checkContractAddress(toAddress, toTotal));
            }
            
            // Get total contracts created
            if(toAddress == null) {
                totalCreatedContracts++;
            }
            
            // Get addresses which sent ether
            var fromAddress = result['from'];
            var fromTotal = parseFloat(web3.utils.fromWei(etherValue.toString(), 'ether'));
            if(fromAddressHashmap.has(fromAddress)) {
                fromTotal += fromAddressHashmap.get(fromAddress);
            }
            if(fromTotal != 0) {
                fromAddressHashmap.set(fromAddress, fromTotal);
                promises2.push(checkContractAddress(fromAddress, fromTotal));
            }  
        });

        // Get contract addresses which received Ether
        const values1 = await Promise.allSettled(promises1);
        var toContractAddress = "", fromContractAddress = "";
        values1.forEach(element => {
            element.value.forEach((value, key) => {
                if(toContractAddressHashmap.has(key)) {
                    value += toContractAddressHashmap.get(key);
                }
                toContractAddressHashmap.set(key, value);
                toAddressHashmap.set(key, value);
                toContractAddress = key;
            });
        });

        // Get contract addresses which sent Ether
        const values2 = await Promise.allSettled(promises2);
        values2.forEach(element => {
            element.value.forEach((value, key) => {
                if(fromContractAddressHashmap.has(key)) {
                    value += fromContractAddressHashmap.get(key);
                }
                fromContractAddressHashmap.set(key, value);
                fromAddressHashmap.set(key, value);
                fromContractAddress = key;
            });
        });

        // Get total contract transactions which transferred Ether
        if(fromContractAddress != "") {
            contractTransactionCount++;
        }
    }

    var totalBlocksEther = web3.utils.fromWei(totalEther.toString(), 'ether');

    // Initialize the Data class with the values
    let data = new Data(totalBlocksEther, toAddressHashmap, fromAddressHashmap, 
        toContractAddressHashmap, fromContractAddressHashmap, totalUncles, 
        totalCreatedContracts, contractTransactionCount, totalTransactionCount, 0, 0, 0);
    return data;
}

module.exports.twoInputGetTransactionData = twoInputGetTransactionData;
module.exports.singleInputGetTransactionData = singleInputGetTransactionData;
