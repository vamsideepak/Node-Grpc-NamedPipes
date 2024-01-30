const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, 'namedpipe.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const NamedService = grpc.loadPackageDefinition(packageDefinition).NamedPipe.NamedPipeService;
const pipePath = "unix:////.//pipe//pipename";

const server = new grpc.Server();

server.bindAsync(pipePath, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error binding server:', err);
    } else {
      console.log('Server bound successfully');
      server.start();
    }
  });

server.addService(NamedService.service, {
  YourRpcMethod: (call, callback) => {
    console.log('method Request', call);
    callback(null, { message: 'Response from server' });
  }
});


// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.tryShutdown(() => {
    console.log('Server shut down gracefully.');
    
  });
});
