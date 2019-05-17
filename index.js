const zmq = require('zeromq');
const Dashcore = require('@dashevo/dashcore-lib');
const RpcClient = require('@dashevo/dashd-rpc');

let config = {
    protocol: 'http',
    user: 'dash',
    pass: 'local321',
    host: '127.0.0.1',
    port: 19998
};

/*

// dash.conf (default location: ~/.dashcore/dash.conf)

server=1
testnet=1
rpcuser=dash
rpcpassword=local321
zmqpubrawchainlock=tcp://127.0.0.1:28332

 */

const rpc = new RpcClient(config); // connect to Dash Core daemon using JSON-RPC

const socket = zmq.socket('sub');

socket.connect('tcp://127.0.0.1:28332'); // connect to Dash Core daemon using ZMQ Notification
socket.subscribe('rawchainlock'); // subscribe to "rawchainlock"

// Fetch Chain Tip from Dash Core Daemon using JSON-RPC
rpc.getBestBlockHash(function (err, res) {
    if (res.result) {
        rpc.getBlock(res.result, function(err, res) {

            console.log("starting block height:", res.result.height);
            console.log("");
            console.log("hash:", res.result.hash);
            console.log("chainlock:", res.result.chainlock);
            console.log("");

        });
    }
});

// Handle ChainLock Notification using ZMQ
socket.on('message', function(topic, message) {
    if (topic.toString() === 'rawchainlock') {

        let block = new Dashcore.Block(message);

        let chainTip = block.toJSON();

        console.log("* zmq notification: rawchainlock *");
        console.log("hash:", chainTip.header.hash);
        console.log("previous hash:", chainTip.header.prevHash);
        console.log("");

    }
});
