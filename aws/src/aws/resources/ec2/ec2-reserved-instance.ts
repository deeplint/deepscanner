import * as AWS from 'aws-sdk';
import { Resource } from '@deeplint/deepscanner-base';
import { AwsProvider } from '../../helper/aws-provider';
import { handle } from '../../helper/aws-error-handler';
import _ = require('lodash');

export class EC2ReservedInstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::ri';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllReservedInstances(context);
  }

  private async listAllReservedInstances(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const riData: AWS.EC2.DescribeReservedInstancesResult = await ec2.describeReservedInstances().promise();
        if (riData && riData.ReservedInstances) {
          for (const reservedInstance of riData.ReservedInstances) {
            if (reservedInstance.ReservedInstancesId) {
              result.push({
                name: 'Reserved Instances',
                type: EC2ReservedInstanceProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  ...reservedInstance,
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
