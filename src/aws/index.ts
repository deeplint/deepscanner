import { S3BucketProvider } from './resources/s3-bucket';

export const AWSResourceMap = {
  'aws::s3::bucket': new S3BucketProvider(),
};
