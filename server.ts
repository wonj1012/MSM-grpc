import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

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

// Replace 'ComputationService' with the actual service name defined in your .proto file
server.addService(computation.ComputationService.service, {
  sendComputationData,
  getComputationResult,
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
