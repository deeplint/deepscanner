import * as AWS from 'aws-sdk';

import { Resource } from '@deeplint/deepscanner-base';
import _ = require('lodash');
import { AwsProvider } from '../../helper/aws-provider';
import { handle } from '../../helper/aws-error-handler';

export class VPCSubnetProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::subnet';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllSubnet(context);
  }

  private async listAllSubnet(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);
    try {
      for (const region of regions) {
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const subnetData: AWS.EC2.DescribeSubnetsResult = await ec2.describeSubnets().promise();
        if (subnetData && subnetData.Subnets) {
          for (const subnet of subnetData.Subnets) {
            if (subnet.SubnetId) {
              result.push({
                name: subnet.SubnetId,
                type: VPCSubnetProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  ...subnet,
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
