import { S3BucketProvider } from './resources/s3-bucket';
import { BaseProvider } from '@deeplint/deepscanner-base';

export const AWSResourceMap: { [key: string]: BaseProvider } = {
  [S3BucketProvider.RESOURCE_TYPE]: new S3BucketProvider(),
};
