import { S3BucketProvider } from './resources/s3-bucket';
import { BaseProvider } from '@deeplint/deepscanner-base';
import { EBSVolumeProvider } from './resources/ebs-volume';
import { EC2InstanceProvider } from './resources/ec2/ec2-instance';
import { EC2EIPProvider } from './resources/ec2/ec2-eip';
import { VPCProvider } from './resources/vpc/vpc';
import { VPCSubnetProvider } from './resources/vpc/vpc-subnet';

export const AWSResourceMap: {
  [key: string]: {
    instance: BaseProvider;
    service: string;
  };
} = {
  [S3BucketProvider.RESOURCE_TYPE]: {
    instance: new S3BucketProvider(),
    service: 'S3',
  },
  [EC2InstanceProvider.RESOURCE_TYPE]: {
    instance: new EC2InstanceProvider(),
    service: 'EC2',
  },
  [EC2EIPProvider.RESOURCE_TYPE]: {
    instance: new EC2EIPProvider(),
    service: 'EC2',
  },
  [EBSVolumeProvider.RESOURCE_TYPE]: {
    instance: new EBSVolumeProvider(),
    service: 'EBS',
  },
  [VPCProvider.RESOURCE_TYPE]: {
    instance: new VPCProvider(),
    service: 'VPC',
  },
  [VPCSubnetProvider.RESOURCE_TYPE]: {
    instance: new VPCSubnetProvider(),
    service: 'VPC',
  },
};
