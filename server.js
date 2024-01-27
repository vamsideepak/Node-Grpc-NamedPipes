const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const net = require('net');

const PROTO_PATH = path.resolve(__dirname, 'namedpipe.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const NamedService = grpc.loadPackageDefinition(packageDefinition).NamedPipe.NamedPipeService;

const server = new grpc.Server();

server.addService(NamedService.service, {
  YourRpcMethod: (call, callback) => {
    callback(null, { message: 'Response from server' });
  }
});

const pipePath = "uds:\\\\.\\pipe\\TEST"

const pipeServer = net.createServer((stream) => {
  server.emit('connection', stream);
});

pipeServer.listen(pipePath, () => {
  console.log(`Server running on named pipe: ${pipePath}`);
  server.bindAsync(pipePath, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error binding server:', err);
    } else {
      console.log('Server bound successfully');
      server.start();
    }
  });
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.tryShutdown(() => {
    console.log('Server shut down gracefully.');
    pipeServer.close();
  });
});
