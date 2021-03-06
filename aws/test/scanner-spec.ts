import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { S3BucketProvider } from '../src/aws/resources/s3-bucket';
import { scan } from '../src';

describe('scanner', () => {
  before(function () {
    // runs once before the first test in this block
  });
  after(function () {
    // runs once after the last test in this block
  });

  /**
  it('should return FullRun Instances', async function () {
    this.timeout(0);
    const res = await scan({});
    console.log(JSON.stringify(res, null, '\t'));
  });
   **/

  it('should return S3 Bucket', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'listBuckets', { Buckets: [{ Name: 'test' }] });
    AWSMock.mock('S3', 'getBucketVersioning', { Status: 'Enabled' });
    AWSMock.mock('S3', 'getBucketEncryption', {});
    AWSMock.mock('S3', 'getBucketPolicyStatus', {});
    const s3provider = new S3BucketProvider();
    const res = await scan({ inputs: { services: ['S3'] } });
    await expect(res.length).to.equal(4);
    const res2 = await s3provider.collect({ inputs: { regions: ['us-east-1'] } });
    await expect(res2.length).to.equal(1);
    AWSMock.restore('S3');
  });
});
