import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const localServer = "localhost:50051";
const remoteServer =
  "ec2-43-203-120-228.ap-northeast-2.compute.amazonaws.com:50051";

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
const computation = protoDescriptor.computation as grpc.GrpcObject;
const computationService = computation[
  "ComputationService"
] as grpc.ServiceClientConstructor;

// Create a client for the ComputationService
const client = new computationService(
  localServer,
  // remoteServer,
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

const streamComputationData = () => {
  const streamRequest = { clientId: "client1" };
  const stream = client.streamComputationData(streamRequest);
  stream.on("data", (data: ComputationData) => {
    console.log(`Received stream data: ${data.data}`);
  });
  stream.on("end", () => {
    console.log("Stream ended.");
  });
};

// Call the methods
sendComputationData();
getComputationResult();

// 스트리밍 데이터 받기 시작
streamComputationData();
