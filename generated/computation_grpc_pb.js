// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var computation_pb = require('./computation_pb.js');

function serialize_computation_ComputationAck(arg) {
  if (!(arg instanceof computation_pb.ComputationAck)) {
    throw new Error('Expected argument of type computation.ComputationAck');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_computation_ComputationAck(buffer_arg) {
  return computation_pb.ComputationAck.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_computation_ComputationRequest(arg) {
  if (!(arg instanceof computation_pb.ComputationRequest)) {
    throw new Error('Expected argument of type computation.ComputationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_computation_ComputationRequest(buffer_arg) {
  return computation_pb.ComputationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_computation_ComputationResult(arg) {
  if (!(arg instanceof computation_pb.ComputationResult)) {
    throw new Error('Expected argument of type computation.ComputationResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_computation_ComputationResult(buffer_arg) {
  return computation_pb.ComputationResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_computation_ResultAck(arg) {
  if (!(arg instanceof computation_pb.ResultAck)) {
    throw new Error('Expected argument of type computation.ResultAck');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_computation_ResultAck(buffer_arg) {
  return computation_pb.ResultAck.deserializeBinary(new Uint8Array(buffer_arg));
}


// The computation service definition.
var ComputationServiceService = exports.ComputationServiceService = {
  // Sends computation data to a node
sendComputationData: {
    path: '/computation.ComputationService/SendComputationData',
    requestStream: false,
    responseStream: false,
    requestType: computation_pb.ComputationRequest,
    responseType: computation_pb.ComputationAck,
    requestSerialize: serialize_computation_ComputationRequest,
    requestDeserialize: deserialize_computation_ComputationRequest,
    responseSerialize: serialize_computation_ComputationAck,
    responseDeserialize: deserialize_computation_ComputationAck,
  },
  // Receives computation results from a node
getComputationResult: {
    path: '/computation.ComputationService/GetComputationResult',
    requestStream: false,
    responseStream: false,
    requestType: computation_pb.ComputationResult,
    responseType: computation_pb.ResultAck,
    requestSerialize: serialize_computation_ComputationResult,
    requestDeserialize: deserialize_computation_ComputationResult,
    responseSerialize: serialize_computation_ResultAck,
    responseDeserialize: deserialize_computation_ResultAck,
  },
};

exports.ComputationServiceClient = grpc.makeGenericClientConstructor(ComputationServiceService);
