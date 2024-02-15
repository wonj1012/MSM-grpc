import * as grpc from "@grpc/grpc-js";

export interface PointRequest {
  x: bigint;
  y: bigint;
  clientId: string;
}

export interface ResultAck {
  success: boolean;
}

export interface StreamRequest {
  clientId: string;
}

export interface ComputationData {
  scalar: bigint[];
  base: {
    x: bigint;
    y: bigint;
  }[];
}

export interface Client {
  id: string;
  stream: grpc.ServerWritableStream<StreamRequest, ComputationData>;
}
