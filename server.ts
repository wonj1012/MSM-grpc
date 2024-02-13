import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

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
  let count = 0;
  const intervalId = setInterval(() => {
    count++;
    if (count > 10) {
      // 예시로 10번 데이터를 보낸 후 종료
      clearInterval(intervalId);
      call.end();
      return;
    }
    const data = { data: `Data ${count}` }; // 연산 데이터 생성
    call.write(data);
  }, 5000); // 5초 간격으로 데이터 보내기
};

server.addService(computation.ComputationService.service, {
  sendComputationData,
  getComputationResult,
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
