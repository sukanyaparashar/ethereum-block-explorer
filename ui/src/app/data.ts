export class Data {
    totalBlocksEther: any;
    toAddressHashmap: any;
    fromAddressHashmap: any;
    toContractAddressHashmap: any;
    fromContractAddressHashmap: any;
    totalUncles: any;
    totalCreatedContracts: any;
    contractTransactionCount: any;
    totalTransactionCount: any;
    contractTransactionPercentage: any;
    uniqueToAddressesCount: any
    uniqueFromAddressesCount: any

    constructor (
        totalBlocksEther = 0, 
        toAddressHashmap = [], 
        fromAddressHashmap = [], 
        toContractAddressHashmap = [], 
        fromContractAddressHashmap = [], 
        totalUncles = 0, 
        totalCreatedContracts = 0, 
        contractTransactionCount = 0, 
        totalTransactionCount = 0,
        contractTransactionPercentage = 0,
        uniqueToAddressesCount = 0,
        uniqueFromAddressesCount = 0) 
    {

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