// Original file: computation.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ComputationAck as _computation_ComputationAck, ComputationAck__Output as _computation_ComputationAck__Output } from '../computation/ComputationAck';
import type { ComputationRequest as _computation_ComputationRequest, ComputationRequest__Output as _computation_ComputationRequest__Output } from '../computation/ComputationRequest';
import type { ComputationResult as _computation_ComputationResult, ComputationResult__Output as _computation_ComputationResult__Output } from '../computation/ComputationResult';
import type { ResultAck as _computation_ResultAck, ResultAck__Output as _computation_ResultAck__Output } from '../computation/ResultAck';

export interface ComputationServiceClient extends grpc.Client {
  GetComputationResult(argument: _computation_ComputationResult, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  GetComputationResult(argument: _computation_ComputationResult, metadata: grpc.Metadata, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  GetComputationResult(argument: _computation_ComputationResult, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  GetComputationResult(argument: _computation_ComputationResult, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  getComputationResult(argument: _computation_ComputationResult, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  getComputationResult(argument: _computation_ComputationResult, metadata: grpc.Metadata, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  getComputationResult(argument: _computation_ComputationResult, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  getComputationResult(argument: _computation_ComputationResult, callback: grpc.requestCallback<_computation_ResultAck__Output>): grpc.ClientUnaryCall;
  
  SendComputationData(argument: _computation_ComputationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  SendComputationData(argument: _computation_ComputationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  SendComputationData(argument: _computation_ComputationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  SendComputationData(argument: _computation_ComputationRequest, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  sendComputationData(argument: _computation_ComputationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  sendComputationData(argument: _computation_ComputationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  sendComputationData(argument: _computation_ComputationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  sendComputationData(argument: _computation_ComputationRequest, callback: grpc.requestCallback<_computation_ComputationAck__Output>): grpc.ClientUnaryCall;
  
}

export interface ComputationServiceHandlers extends grpc.UntypedServiceImplementation {
  GetComputationResult: grpc.handleUnaryCall<_computation_ComputationResult__Output, _computation_ResultAck>;
  
  SendComputationData: grpc.handleUnaryCall<_computation_ComputationRequest__Output, _computation_ComputationAck>;
  
}

export interface ComputationServiceDefinition extends grpc.ServiceDefinition {
  GetComputationResult: MethodDefinition<_computation_ComputationResult, _computation_ResultAck, _computation_ComputationResult__Output, _computation_ResultAck__Output>
  SendComputationData: MethodDefinition<_computation_ComputationRequest, _computation_ComputationAck, _computation_ComputationRequest__Output, _computation_ComputationAck__Output>
}
