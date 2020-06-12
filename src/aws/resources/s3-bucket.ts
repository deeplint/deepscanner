import { Resource } from 'deeplint/lib/lib/policy/model';
import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';

export class S3BucketProvider extends AwsProvider {
  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(JSON.stringify(context) + 'context');
    return this.listAllBuckets();
  }

  private async listAllBuckets(): Promise<Resource[]> {
    const result: Resource[] = [];
    try {
      const s3 = this.getClient('S3', 'us-east-1') as AWS.S3;
      const s3BucketsData: AWS.S3.ListBucketsOutput = await s3.listBuckets().promise();
      if (s3BucketsData && s3BucketsData.Buckets) {
        for (const bucket of s3BucketsData.Buckets) {
          if (bucket.Name) {
            const versioning: AWS.S3.GetBucketVersioningOutput = await s3
              .getBucketVersioning({ Bucket: bucket.Name })
              .promise();
            result.push({
              name: bucket.Name,
              type: 'aws-s3-bucket',
              properties: { VersioningConfiguration: { Status: versioning.Status } },
            });
          }
        }
      }
    } catch (error) {
      handle(error);
    }
    return result;
  }
}
