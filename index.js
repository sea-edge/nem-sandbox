require('dotenv').config();
const nem = require("nem-sdk").default;


console.log(process.env.PRIVATE_KEY.length);

// Create an NIS endpoint object
// ref: https://testnet-explorer.nemtool.com/#/nodelist
// const endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
const endpoint = nem.model.objects.create("endpoint")("http://95.216.73.243", nem.model.nodes.defaultPort);

const networkId = nem.model.network.data.testnet.id;
// const networkId = nem.model.network.data.mainnet.id;

// Create a common object holding key
const common = nem.model.objects.create("common")("", process.env.PRIVATE_KEY);
const keyPair = nem.crypto.keyPair.create(process.env.PRIVATE_KEY);
const publicKey = keyPair.publicKey.toString();
const fromAddress = nem.model.address.toAddress(publicKey, networkId);
// const toAddress = "toAddress";
const toAddress = fromAddress;
console.log(`from: ${fromAddress}`)
const sendMsg = '';

// Create an un-prepared transfer transaction object
const transferTransaction = nem.model.objects.create("transferTransaction")(toAddress, 1, sendMsg);

// Prepare the transfer transaction object
const transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

// Serialize transfer transaction and announce
nem.com.requests.chain.time(endpoint).then(time=> {
    let ts = Math.floor(time.receiveTimeStamp / 1000);
    console.log(time);
    console.log(transactionEntity);  //print timestamp in entity using local time
    transactionEntity.timeStamp = ts;
    let due = 60;
    transactionEntity.deadline = ts + due * 60;
    console.log(transactionEntity); //print timestamp in entity with the network time
    return nem.model.transactions.send(common, transactionEntity, endpoint).then(res => {
        console.log('txRes:', JSON.stringify(res));
    }).catch(err => {
        console.log('txErr:', err);
    });
});
