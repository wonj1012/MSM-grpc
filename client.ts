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

// Example call for sendComputationData
const sendComputationData = () => {
  const requestData = { data: "Your computation data here" };
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

// Example call for getComputationResult
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

// Call the methods
sendComputationData();
getComputationResult();
