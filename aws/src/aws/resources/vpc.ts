import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';
import _ = require('lodash');

export class VPCProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::vpc';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllVpc(context);
  }

  private async listAllVpc(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const vpcsData: AWS.EC2.DescribeVpcsResult = await ec2.describeVpcs().promise();
        if (vpcsData && vpcsData.Vpcs) {
          for (const vpc of vpcsData.Vpcs) {
            if (vpc.VpcId) {
              result.push({
                name: vpc.VpcId,
                type: VPCProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  ...vpc,
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
