import * as AWS from 'aws-sdk';
import { Resource } from '@deeplint/deepscanner-base';
import { AwsProvider } from '../../helper/aws-provider';
import _ = require('lodash');
import { handle } from '../../helper/aws-error-handler';

export class EC2FleetInstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::ec2fleet';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllFleetInstance(context);
  }

  private async listAllFleetInstance(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const params = {
          FleetId: 'FLEET_INSTANCE_ID' /* required */,
        };
        const fleetInstanceData: AWS.EC2.DescribeFleetInstancesResult = await ec2
          .describeFleetInstances(params)
          .promise();
        if (fleetInstanceData && fleetInstanceData.ActiveInstances) {
          for (const fleetInstance of fleetInstanceData.ActiveInstances) {
            if (fleetInstance.InstanceId) {
              result.push({
                name: 'Fleet Instance',
                type: EC2FleetInstanceProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  ...fleetInstance,
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
