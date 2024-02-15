import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import fs from "fs";
// import { Point } from "multi-scalar-multiplication/dist/cjs/ellipticCurve";
import {
  Point,
  bigintPair,
  MultiScalarMultiplication,
  EllipticCurve,
} from "multi-scalar-multiplication";
// Structure to hold client information and stream
interface Client {
  id: string;
  stream: grpc.ServerWritableStream<StreamRequest, ComputationData>;
}

const clients: Client[] = [];
const points: PointRequest[] = [];

const time = {} as any;

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

// load msm data
const scalarData = fs.readFileSync(
  path.join(__dirname, "data", "scalars.txt"),
  "utf8"
);
const rawScalars = scalarData.split("\n");
const scalarDataArray = rawScalars.map((s) => BigInt(s));

const baseData = fs.readFileSync(
  path.join(__dirname, "data", "bases.txt"),
  "utf8"
);
const rawBases = baseData.split("\n");
const baseDataArray = rawBases.map((b) => {
  const [left, right] = b.split(", ");
  return {
    x: BigInt(left.replace("(", "")),
    y: BigInt(right.replace(")", "")),
  };
});

// Define Curve
const a: bigint = 0n;
const b: bigint = 3n;
const p: bigint =
  21888242871839275222246405745257275088696311157297823662689037894645226208583n;

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

const calcMsm: grpc.handleUnaryCall<ComputationData, ResultAck> = (
  call,
  callback
) => {
  console.log("!!!!!!!!!!!!!!!!calcm!!!!!!!!!!!!!!!!!!");
  const a: bigint = 0n;
  const b: bigint = 3n;
  const p: bigint =
    21888242871839275222246405745257275088696311157297823662689037894645226208583n;

  const splited = scalarDataArray.slice(0, SIZE);

  // for (let index = 0; index < 4; index++) {
  //   const base = baseDataArray.slice(index * SIZE, index * SIZE + SIZE - 1);
  //   const scalar = scalarDataArray.slice(index * SIZE, index * SIZE + SIZE - 1);
  // }

  console.time("calcMSM");
  for (let i = 0; i < 4; i++) {
    const msm = new MultiScalarMultiplication(a, b, p);
    msm.loadData(scalarDataArray, baseDataArray);
    const result: Point = msm.calculate();
    const { x, y } = result;
    console.log("x, y", x.value, y.value);
  }
  console.timeEnd("calcMSM");
  callback(null, { success: true });
};

// receive Point which calculated by client
const sendPoint: grpc.handleUnaryCall<PointRequest, ResultAck> = (
  call,
  callback
) => {
  const { x: xValue, y: yValue, clientId } = call.request;
  const x = BigInt(xValue);
  const y = BigInt(yValue);

  const existingClient = points.find((point) => point.clientId === clientId);
  if (!existingClient) {
    points.push({ x, y, clientId });
  }
  if (points.length === 4) {
    const curve = new EllipticCurve(a, b, p);
    const basePoint: Point = new Point(0n, 0n, curve);
    const result = points.reduce((acc, point) => {
      console.log("x, y", point.x, point.y);
      const p = new Point(point.x, point.y, curve);
      return acc.add(p);
    }, basePoint);
    const { x, y } = result;
    console.log("!!!!!!!!!!!!!!!!result!!!!!!!!!!!!!!!!!!");
    console.log("x, y", x.value, y.value);
  }
  time.end = new Date().getTime();
  console.log("time", time);
  console.log("time passed", time.end - time.start + "ms");
  callback(null, { success: true });
};

const streamComputationData: grpc.handleServerStreamingCall<
  StreamRequest,
  ComputationData
> = (call) => {
  const clientId = call.request.clientId;
  console.log(`Client connected: ${clientId}, from ${call.getPeer()}`);

  const existingClient = clients.find((client) => client.id === clientId);
  if (!existingClient) {
    clients.push({ id: clientId, stream: call }); // Store client info and stream
  }

  // Check if 4 clients have connected, then broadcast a message
  if (clients.length === 4) {
    console.log("Broadcasting message to all clients");
    time.start = new Date().getTime();
    clients.forEach((client, index) => {
      // const base = baseDataArray.slice(index * SIZE, index * SIZE + SIZE - 1);
      // const scalar = scalarDataArray.slice(
      //   index * SIZE,
      //   index * SIZE + SIZE - 1
      // );
      client.stream.write({
        scalar: scalarDataArray,
        base: baseDataArray,
      }); // Replace 'hello' with your actual data
    });
  } else {
    console.log(`Waiting for more clients. Current count: ${clients.length}`);
  }
};

server.addService(computation.ComputationService.service, {
  streamComputationData,
  sendPoint,
  calcMsm,
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

// quotient of 1024
const SIZE = 256;
