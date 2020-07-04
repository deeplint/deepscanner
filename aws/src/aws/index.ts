import { S3BucketProvider } from './resources/s3-bucket';
import { EC2InstanceProvider } from './resources/ec2-instance';
import { EBStoreProvider } from './resources/ebs-store';
import { EIPProvider } from './resources/eip';
import { VPCProvider } from './resources/vpc';
import { SubnetProvider } from './resources/subnet';

import { ReservedInstanceProvider } from './resources/reserved-instance';
// import { SpotInstanceProvider } from './resources/spot-instance';
// import { FleetInstanceProvider } from './resources/fleet-instance';
// import  { AmiImageProvider } from './resources/ami';
import { BaseProvider } from '@deeplint/deepscanner-base';

export const AWSResourceMap: { [key: string]: BaseProvider } = {
  [S3BucketProvider.RESOURCE_TYPE]: new S3BucketProvider(),
  [EC2InstanceProvider.RESOURCE_TYPE]: new EC2InstanceProvider(),
  [EBStoreProvider.RESOURCE_TYPE]: new EBStoreProvider(),
  [EIPProvider.RESOURCE_TYPE]: new EIPProvider(),
  [VPCProvider.RESOURCE_TYPE]: new VPCProvider(),
  [SubnetProvider.RESOURCE_TYPE]: new SubnetProvider(),

  [ReservedInstanceProvider.RESOURCE_TYPE]: new ReservedInstanceProvider(),
  // [SpotInstanceProvider.RESOURCE_TYPE]: new SpotInstanceProvider(),
  // [FleetInstanceProvider.RESOURCE_TYPE]: new FleetInstanceProvider(),
  // [AmiImageProvider.RESOURCE_TYPE]: new AmiImageProvider(),
};
