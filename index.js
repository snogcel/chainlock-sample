let zmq = require('zeromq');

let socket = zmq.socket('sub');
socket.connect('tcp://127.0.0.1:28332'); // connect to Dash Core daemon using the following configuration...

/*

// dash.conf (default location: ~/.dashcore/dash.conf)

server=1
testnet=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubrawblock=tcp://127.0.0.1:28332

 */

socket.subscribe('rawblock'); // subscribe to "zmqpubrawblock"
socket.subscribe('rawtx'); // subscribe to "zmqpubrawtx"

console.log('Connected to daemon using port 28332');

socket.on('message', function(topic, message) {
    console.log('received a message related to:', topic.toString(), 'containing message:', message);
});
