var express = require("express");
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());
var web3 = require('./ethereum/main');

function mapReplacer(key, value) {
    if(value instanceof Map || value instanceof Set) {
        return [...value]
    }
    return value
}

app.post('/data-two', async function(req, res){
    var data = await web3.twoInputGetTransactionData(req.body.from_block, req.body.to_block);
    res.send(JSON.stringify(data, mapReplacer));
});

app.post('/data-single', async function(req, res){
    var data = await web3.singleInputGetTransactionData(req.body.number);
    res.send(JSON.stringify(data, mapReplacer));
});

app.listen(3030, function() {
    console.log('App listening on port 3030!')
});