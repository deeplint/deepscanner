import * as AWS from 'aws-sdk';

export class AwsClientsHelper {
  public static getClient(serviceName: string, region: string): AWS.Service {
    let client;
    switch (serviceName) {
      case 'S3':
        client = new AWS.S3({
          region: region,
        });
        break;
      default:
        throw new Error('Incorrect AWS services');
    }
    return client;
  }
}
