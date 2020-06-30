import { scan } from '../src';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { expect } from 'chai';

describe('scanner', () => {
  before(function () {
    // runs once before the first test in this block
  });
  after(function () {
    // runs once after the last test in this block
  });

  // it('should return FullRun Instances', async () => {
  //   const res = await scan({});
  //   console.log(res);
  // });

  it('should return S3 Bucket', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'listBuckets', { Buckets: [{ Name: 'test' }] });
    AWSMock.mock('S3', 'getBucketVersioning', { Status: 'Enabled' });
    const res = await scan({});
    console.log(res);
    expect(res.length).to.equal(4);
    AWSMock.restore('S3');
  });
  
});
