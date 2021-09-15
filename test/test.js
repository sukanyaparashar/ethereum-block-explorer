const assert = require('assert');
const Web3 = require('web3');
const etherTool = require('../ethereum/main');

const { abi, bytecode } = require('../compile');
const ethNetwork = 'http://127.0.0.1:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

var accounts;
var hello;

describe('Test Ether Transfers', () => {
    it('get accounts', async () => {
        accounts = await web3.eth.getAccounts();
    });

    it('deploy contract', async () => {
        hello = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode, arguments: ['Hey Consensys'] })
            .send({ from: accounts[0], gas: '1000000' });
        assert.ok(hello.options.address);
    });

    it('balance of accounts[1] should be 110', async () => {
        await web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], value: web3.utils.toWei("10", "ether") });
        var balanceInWei = await web3.eth.getBalance(accounts[1]);
        var balanceInEther = parseFloat(web3.utils.fromWei(balanceInWei, "ether"));
        assert.equal(110, balanceInEther);
    });

    it('balance of accounts[3] should be 120', async () => {
        await web3.eth.sendTransaction({ from: accounts[2], to: accounts[3], value: web3.utils.toWei("20", "ether") });
        var balanceInWei = await web3.eth.getBalance(accounts[3]);
        var balanceInEther = parseFloat(web3.utils.fromWei(balanceInWei, "ether"));
        assert.equal(120, balanceInEther);
    });

    it('balance of accounts[5] should be 130', async () => {
        await web3.eth.sendTransaction({ from: accounts[4], to: accounts[5], value: web3.utils.toWei("30", "ether") });
        var balanceInWei = await web3.eth.getBalance(accounts[5]);
        var balanceInEther = parseFloat(web3.utils.fromWei(balanceInWei, "ether"));
        assert.equal(130, balanceInEther);
    });

    it('balance of contract deployed should be 40', async () => {
        await web3.eth.sendTransaction({ from: accounts[6], to: hello.options.address, value: web3.utils.toWei("40", "ether") });
        var balanceInWei = await web3.eth.getBalance(hello.options.address);
        var balanceInEther = parseFloat(web3.utils.fromWei(balanceInWei, "ether"));
        assert.equal(40, balanceInEther);
    });

    it('ether cash flow details from 1st input block number to 2nd input block number', async () => {    
        var toAddressHashmap = new Map();
        toAddressHashmap.set(accounts[1], 10);
        toAddressHashmap.set(accounts[3], 20);
        toAddressHashmap.set(accounts[5], 30);
        toAddressHashmap.set(hello.options.address, 40);

        var fromAddressHashmap = new Map();
        fromAddressHashmap.set(accounts[0], 10);
        fromAddressHashmap.set(accounts[2], 20);
        fromAddressHashmap.set(accounts[4], 30);
        fromAddressHashmap.set(accounts[6], 40);

        var toContractAddressHashmap = new Map();
        toContractAddressHashmap.set(hello.options.address, 40);

        var fromContractAddressHashmap = new Map();

        var promises = [];
        var promise = await etherTool.twoInputGetTransactionData(1, 5);
        promises.push(promise);
        const values = await Promise.allSettled(promises);
        values.forEach(element => {
            var data = element.value;
            assert.equal(100, data.totalBlocksEther);
            assert.equal(1, data.totalCreatedContracts);
            assert.equal(0, data.totalUncles);
            assert.equal(0, data.contractTransactionCount);
            assert.equal(5, data.totalTransactionCount);
            assert.equal(0, data.contractTransactionPercentage);
            assert.equal(4, data.uniqueToAddressesCount);
            assert.equal(4, data.uniqueFromAddressesCount);
            assert.equal(true, compareMaps(toAddressHashmap, data.toAddressHashmap));
            assert.equal(true, compareMaps(fromAddressHashmap, data.fromAddressHashmap));
            assert.equal(true, compareMaps(toContractAddressHashmap, data.toContractAddressHashmap));
            assert.equal(true, compareMaps(fromContractAddressHashmap, data.fromContractAddressHashmap));
        });
    });

    it('ether cash flow details from (latest block minus input number) to the latest block', async () => {
        var toAddressHashmap = new Map();
        toAddressHashmap.set(accounts[1], 10);
        toAddressHashmap.set(accounts[3], 20);
        toAddressHashmap.set(accounts[5], 30);
        toAddressHashmap.set(hello.options.address, 40);

        var fromAddressHashmap = new Map();
        fromAddressHashmap.set(accounts[0], 10);
        fromAddressHashmap.set(accounts[2], 20);
        fromAddressHashmap.set(accounts[4], 30);
        fromAddressHashmap.set(accounts[6], 40);

        var toContractAddressHashmap = new Map();
        toContractAddressHashmap.set(hello.options.address, 40);

        var fromContractAddressHashmap = new Map();

        var promises = [];
        var promise = await etherTool.singleInputGetTransactionData(4);
        promises.push(promise);
        const values = await Promise.allSettled(promises);
        values.forEach(element => {
            var data = element.value;
            assert.equal(100, data.totalBlocksEther);
            assert.equal(1, data.totalCreatedContracts);
            assert.equal(0, data.totalUncles);
            assert.equal(0, data.contractTransactionCount);
            assert.equal(5, data.totalTransactionCount);
            assert.equal(0, data.contractTransactionPercentage);
            assert.equal(4, data.uniqueToAddressesCount);
            assert.equal(4, data.uniqueFromAddressesCount);
            assert.equal(true, compareMaps(toAddressHashmap, data.toAddressHashmap));
            assert.equal(true, compareMaps(fromAddressHashmap, data.fromAddressHashmap));
            assert.equal(true, compareMaps(toContractAddressHashmap, data.toContractAddressHashmap));
            assert.equal(true, compareMaps(fromContractAddressHashmap, data.fromContractAddressHashmap));
        });
    });
});

function compareMaps(map1, map2) {
    if(map1.size != map2.size) {
        return false;
    }
    var keys1 = map1.keys();
    var keys2 = map2.keys();
    for(i = 0; i < keys1.length; i++) {
        if(keys1[i] != keys2[i] || map1.get(keys1[i]) != map2.get(keys2[i])) {
            return false;
        }
    }
    return true;
}