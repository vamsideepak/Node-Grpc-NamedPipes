const net = require('net');

const pipePath = 'uds:\\\\.\\pipe\\AYYAR'

const pipeServer = net.createServer();

pipeServer.listen(pipePath, () => {
    console.log(`Named pipe server running on: ${pipePath}`);
});

pipeServer.on('connection', (socket) => {
    console.log('Client connected to named pipe');
    // Handle client communication here
});
