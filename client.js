    const grpc = require('@grpc/grpc-js');
    const protoLoader = require('@grpc/proto-loader');
    const path = require('path');

    const PROTO_PATH = path.resolve(__dirname, 'namedpipe.proto');

    const packageDefinition = protoLoader.loadSync(PROTO_PATH);
    const namedService = grpc.loadPackageDefinition(packageDefinition).NamedPipe.NamedPipeService;

    const pipePath = "unix:////.//pipe//pipename";

    const client = new namedService(pipePath, grpc.credentials.createInsecure());

    client.YourRpcMethod({ message: 'Request from client' }, (error, response) => {
    if (!error) {
        console.log('Response:', response.message);
    } else {
        console.error('Error:', error);
    }
    });
