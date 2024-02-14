import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
// Structure to hold client information and stream
interface Client {
  id: string;
  stream: grpc.ServerWritableStream<StreamRequest, ComputationData>;
}

const clients: Client[] = [];

interface StreamRequest {
  clientId: string;
}

interface ComputationData {
  data: string;
}

// Define the path to your .proto file
const PROTO_PATH = path.resolve(__dirname, "computation.proto");

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Assume your package is named "computation"
const computation = protoDescriptor.computation as any;

const server = new grpc.Server();

const sendComputationData: grpc.handleUnaryCall<any, any> = (
  call,
  callback
) => {
  console.log(`Received computation data: ${call.request.data}`);
  callback(null, { success: true });
};

const getComputationResult: grpc.handleUnaryCall<any, any> = (
  call,
  callback
) => {
  console.log(`Received computation result: ${call.request.result}`);
  callback(null, { success: true });
};

const streamComputationData: grpc.handleServerStreamingCall<
  StreamRequest,
  ComputationData
> = (call) => {
  console.log("streamComputationData");

  const clientId = call.request.clientId;
  console.log(`Client connected: ${clientId}, from ${call.getPeer()}`);

  const existingClient = clients.find((client) => client.id === clientId);
  if (!existingClient) {
    clients.push({ id: clientId, stream: call }); // Store client info and stream
  }

  // Check if 4 clients have connected, then broadcast a message
  if (clients.length === 4) {
    console.log("Broadcasting message to all clients");
    clients.forEach((client) => {
      client.stream.write({ data: "hello" }); // Replace 'hello' with your actual data
    });
  } else {
    console.log(`Waiting for more clients. Current count: ${clients.length}`);
  }
};

server.addService(computation.ComputationService.service, {
  streamComputationData,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(error);
      return;
    }
    server.start();
    console.log(`Server running at http://0.0.0.0:${port}`);
  }
);
