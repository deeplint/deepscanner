import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deepscanner/base';

export class S3BucketProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::s3::bucket';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllBuckets();
  }

  private async listAllBuckets(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'S3';
    try {
      for (const region of this.getRegions(serviceName)) {
        const s3 = this.getClient(serviceName, region) as AWS.S3;
        const s3BucketsData: AWS.S3.ListBucketsOutput = await s3.listBuckets().promise();
        if (s3BucketsData && s3BucketsData.Buckets) {
          for (const bucket of s3BucketsData.Buckets) {
            if (bucket.Name) {
              const versioning: AWS.S3.GetBucketVersioningOutput = await s3
                .getBucketVersioning({ Bucket: bucket.Name })
                .promise();
              result.push({
                name: bucket.Name,
                type: S3BucketProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  VersioningConfiguration: { Status: versioning.Status },
                },
              });
            }
          }
        }
      }
    } catch (error) {
      handle(error);
    }
    return result;
  }
}
