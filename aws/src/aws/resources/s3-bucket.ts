import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';
import _ = require('lodash');

export class S3BucketProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::s3::bucket';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllBuckets(context);
  }

  private async listAllBuckets(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'S3';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        const s3 = this.getClient(serviceName, region) as AWS.S3;
        const s3BucketsData: AWS.S3.ListBucketsOutput = await s3.listBuckets().promise();
        if (s3BucketsData && s3BucketsData.Buckets) {
          for (const bucket of s3BucketsData.Buckets) {
            if (bucket.Name) {
              const BucketVersioning: AWS.S3.GetBucketVersioningOutput = await s3
                .getBucketVersioning({ Bucket: bucket.Name })
                .promise();
              let BucketEncryption: AWS.S3.GetBucketEncryptionOutput;
              let BucketPolicyStatus: AWS.S3.GetBucketPolicyStatusOutput;
              try {
                BucketEncryption = await s3.getBucketEncryption({ Bucket: bucket.Name }).promise();
                BucketPolicyStatus = await s3.getBucketPolicyStatus({ Bucket: bucket.Name }).promise();
              } catch (error) {
                BucketPolicyStatus = {};
                BucketEncryption = {};
              }

              result.push({
                name: bucket.Name,
                type: S3BucketProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  BucketVersioning: BucketVersioning,
                  BucketPolicyStatus: BucketPolicyStatus,
                  BucketEncryption: BucketEncryption,
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
