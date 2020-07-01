import { S3BucketProvider } from './resources/s3-bucket';
import { EC2InstanceProvider } from './resources/e2-instance';
import { EBStoreProvider } from './resources/ebs-store';
import { BaseProvider } from '@deeplint/deepscanner-base';

export const AWSResourceMap: { [key: string]: BaseProvider } = {
  [S3BucketProvider.RESOURCE_TYPE]: new S3BucketProvider(),
  [EC2InstanceProvider.RESOURCE_TYPE]: new EC2InstanceProvider(),
  [EBStoreProvider.RESOURCE_TYPE]: new EBStoreProvider(),
};
