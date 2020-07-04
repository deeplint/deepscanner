import * as AWS from 'aws-sdk';

export class AwsClientsHelper {
  public static getClient(serviceName: string, region: string): AWS.Service {
    console.log(serviceName, region);
    let client;
    switch (serviceName) {
      case 'S3':
        client = new AWS.S3({
          region: region,
        });
        break;
      case 'EC2':
        client = new AWS.EC2({
          apiVersion: '2016-11-15',
        });
        break;
      default:
        throw new Error('Incorrect AWS services');
    }
    return client;
  }
}
