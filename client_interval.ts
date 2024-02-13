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

// Create a client for the ComputationService
const client = new computation.ComputationService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Function to call sendComputationData
const sendComputationData = () => {
  const requestData = { data: "Computation Data #2" };
  client.sendComputationData(
    requestData,
    (error: grpc.ServiceError | null, response: any) => {
      if (error) {
        console.error(`Error calling sendComputationData: ${error.message}`);
      } else {
        console.log(
          `Received from sendComputationData: ${JSON.stringify(response)}`
        );
      }
    }
  );
};

// Function to call getComputationResult
const getComputationResult = () => {
  const requestResult = { result: "Your computation result data here" };
  client.getComputationResult(
    requestResult,
    (error: grpc.ServiceError | null, response: any) => {
      if (error) {
        console.error(`Error calling getComputationResult: ${error.message}`);
      } else {
        console.log(
          `Received from getComputationResult: ${JSON.stringify(response)}`
        );
      }
    }
  );
};

// Schedule sendComputationData and getComputationResult to be called every 5 seconds
setInterval(sendComputationData, 5000);
setInterval(getComputationResult, 5000);
