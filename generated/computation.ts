import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ComputationServiceClient as _computation_ComputationServiceClient, ComputationServiceDefinition as _computation_ComputationServiceDefinition } from './computation/ComputationService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  computation: {
    ComputationAck: MessageTypeDefinition
    ComputationRequest: MessageTypeDefinition
    ComputationResult: MessageTypeDefinition
    ComputationService: SubtypeConstructor<typeof grpc.Client, _computation_ComputationServiceClient> & { service: _computation_ComputationServiceDefinition }
    ResultAck: MessageTypeDefinition
  }
}

