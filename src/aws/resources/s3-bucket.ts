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
      s3BucketsData.Buckets?.forEach((bucket) => {
        if (bucket.Name) {
          result.push({
            name: bucket.Name,
            type: 'aws-s3-bucket',
            properties: {},
          });
        }
      });
    } catch (error) {
      handle(error);
    }
    return result;
  }
}
