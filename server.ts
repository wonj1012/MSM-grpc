import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import fs from "fs";
// import { Point } from "multi-scalar-multiplication/dist/cjs/ellipticCurve";
import { Point, MultiScalarMultiplication } from "multi-scalar-multiplication";
import {
  Client,
  ComputationData,
  PointRequest,
  ResultAck,
  StreamRequest,
} from "./types";
import { LENGTH } from "./constant";

const SIZE = 256;

const clients: Client[] = [];
const points: PointRequest[] = [];

const time = {} as any;

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

const PROTO_PATH = path.resolve(__dirname, "computation.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const computation = protoDescriptor.computation as any;

const server = new grpc.Server();

const calcMsm: grpc.handleUnaryCall<ComputationData, ResultAck> = (
  call,
  callback
) => {
  console.log("=== Calculate MSM Start===");
  console.log(
    "Elliptic Curve: y^2 = x^3 + 3, p: 21888242871839275222246405745257275088696311157297823662689037894645226208583"
  );
  console.log("Base Point: (0, 0)");
  console.log("Input data size: 2^13");

  const a: bigint = 0n;
  const b: bigint = 3n;
  const p: bigint =
    21888242871839275222246405745257275088696311157297823662689037894645226208583n;

  console.time("MSM calculation");
  for (let i = 0; i < LENGTH; i++) {
    const msm = new MultiScalarMultiplication(a, b, p);
    msm.loadData(scalarDataArray, baseDataArray);
    const result: Point = msm.calculate();
    if (i % 2 === 0) {
      console.log("Running...");
    }
  }
  console.timeEnd("MSM calculation");
  console.log("=== Calculate MSM End===");
  callback(null, { success: true });
};

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
    console.log("== Point received ==");
  }
  if (points.length === LENGTH) {
    // const curve = new EllipticCurve(a, b, p);
    // const basePoint: Point = new Point(0n, 0n, curve);
    // const result = points.reduce((acc, point) => {
    //   console.log("x, y", point.x, point.y);
    //   const p = new Point(point.x, point.y, curve);
    //   return acc.add(p);
    // }, basePoint);
    console.log("=== All the point received ===");
    time.end = new Date().getTime();
    console.log(`=== Time passed ${time.end - time.start}ms ===`);

    // clear data
    clients.splice(0, clients.length);
    points.splice(0, points.length);
    callback(null, { success: true });
  }
};

const streamComputationData: grpc.handleServerStreamingCall<
  StreamRequest,
  ComputationData
> = (call) => {
  const clientId = call.request.clientId;

  const existingClient = clients.find((client) => client.id === clientId);
  if (!existingClient) {
    clients.push({ id: clientId, stream: call }); // Store client info and stream
  }
  if (clients.length === 1) {
    console.log(`=== Client Connected ===`);
  }
  console.log(`== Client: ${clientId}, from ${call.getPeer()} == `);

  // If all clients are connected, broadcast a message
  if (clients.length === LENGTH) {
    console.log("=== All clients connected, BroadCast msm ===");
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
      });
    });
  } else {
    console.log(
      `== Waiting for more clients. Count: ${clients.length} / ${LENGTH} ==`
    );
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
