import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { uuid } from "uuidv4";
import { MultiScalarMultiplication, Point } from "multi-scalar-multiplication";
import { localServer, remoteServer, useLocal } from "./constant";
// import { Point } from "multi-scalar-multiplication/dist/cjs/ellipticCurve";
// import {
//   bigintPair,
//   MultiScalarMultiplication,
// } from "multi-scalar-multiplication/dist/cjs/multiScalarMultiplication";

const id = uuid();

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
  useLocal ? localServer : remoteServer,
  grpc.credentials.createInsecure()
);

const calcMSM = () => {
  const request = {
    data: "hi",
  };
  client.calcMSM(request, (error: grpc.ServiceError | null, response: any) => {
    if (error) {
      console.error(`Error calling calcMSM: ${error.message}`);
    } else {
      console.log(`Received from calcMSM: ${JSON.stringify(response)}`);
    }
  });
};

// 2^10 data => server calculate solely
// 1.362s
// x, y 12271046154391110796903056111260301140711180019236526893758713726553427189013n 13974163643433631386626173173419578363381003247600587944829073839661880038173n
calcMSM();
