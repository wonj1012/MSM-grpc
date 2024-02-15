import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { uuid } from "uuidv4";
import { MultiScalarMultiplication, Point } from "multi-scalar-multiplication";
// import { Point } from "multi-scalar-multiplication/dist/cjs/ellipticCurve";
// import {
//   bigintPair,
//   MultiScalarMultiplication,
// } from "multi-scalar-multiplication/dist/cjs/multiScalarMultiplication";

const id = uuid();

const localServer = "localhost:50051";
const remoteServer =
  "ec2-43-203-120-228.ap-northeast-2.compute.amazonaws.com:50051";

interface PointRequest {
  x: bigint;
  y: bigint;
  clientId: string;
}
interface ResultAck {
  success: boolean;
}

interface StreamRequest {
  clientId: string;
}

interface ComputationData {
  scalar: bigint[];
  base: {
    x: bigint;
    y: bigint;
  }[];
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
const sendPoint = (point: Point) => {
  const { x, y } = point;
  const request = {
    x: x.value,
    y: y.value,
    clientId: id,
  };
  client.sendPoint(
    request,
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

const streamComputationData = () => {
  const streamRequest = { clientId: id };
  const stream = client.streamComputationData(streamRequest);
  stream.on("data", (data: ComputationData) => {
    const { scalar, base } = data;
    const requestData = {
      scalar,
      base,
    };
    // for giving example
    const a: bigint = 0n;
    const b: bigint = 3n;
    const p: bigint =
      21888242871839275222246405745257275088696311157297823662689037894645226208583n;

    const msm = new MultiScalarMultiplication(a, b, p);
    const bigintScalar = scalar.map((s) => BigInt(s));
    const bigintBase = base.map((b) => {
      return {
        x: BigInt(b.x),
        y: BigInt(b.y),
      };
    });
    msm.loadData(bigintScalar, bigintBase);
    console.time("calculate");
    const result: Point = msm.calculate();
    console.timeEnd("calculate");
    sendPoint(result);
  });
  stream.on("end", () => {
    console.log("Stream ended.");
  });
};

// 스트리밍 데이터 받기 시작

// 2^10 data => 4 client calculate 2^8 data each
// 589ms
// x, y 16769977055440139663044837453504611513502435098538849181162246969510309044676n 8563546506158490061392739186455054238347184995957357525647365730964279358552n
streamComputationData();

// 2^10 data => server calculate solely
// 1.362s
// x, y 12271046154391110796903056111260301140711180019236526893758713726553427189013n 13974163643433631386626173173419578363381003247600587944829073839661880038173n
// calcMSM();
