import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';
import _ = require('lodash');

export class EC2EIPProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::eip';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllAddresses(context);
  }

  private async listAllAddresses(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);
    try {
      for (const region of regions) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const eipAddressData: AWS.EC2.DescribeAddressesResult = await ec2.describeAddresses().promise();
        if (eipAddressData && eipAddressData.Addresses) {
          for (const address of eipAddressData.Addresses) {
            if (address.PublicIp) {
              result.push({
                name: address.PublicIp,
                type: EC2EIPProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  ...address,
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
