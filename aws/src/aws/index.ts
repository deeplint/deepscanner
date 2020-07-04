import { S3BucketProvider } from './resources/s3-bucket';
import { EC2InstanceProvider } from './resources/ec2-instance';
import { VPCProvider } from './resources/vpc';
import { BaseProvider } from '@deeplint/deepscanner-base';
import { VPCSubnetProvider } from './resources/vpc-subnet';
import { EC2EIPProvider } from './resources/ec2-eip';
import { EBSVolumeProvider } from './resources/ebs-volume';

export const AWSResourceMap: { [key: string]: BaseProvider } = {
  [S3BucketProvider.RESOURCE_TYPE]: new S3BucketProvider(),
  [EC2InstanceProvider.RESOURCE_TYPE]: new EC2InstanceProvider(),
  [EBSVolumeProvider.RESOURCE_TYPE]: new EBSVolumeProvider(),
  [EC2EIPProvider.RESOURCE_TYPE]: new EC2EIPProvider(),
  [VPCProvider.RESOURCE_TYPE]: new VPCProvider(),
  [VPCSubnetProvider.RESOURCE_TYPE]: new VPCSubnetProvider(),
};
