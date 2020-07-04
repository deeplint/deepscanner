import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class FleetInstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::ec2fleet';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllFleetInstance();
  }

  private async listAllFleetInstance(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const params = {
          FleetId: "FLEET_INSTANCE_ID" /* required */
        };
        const fleetInstanceData: AWS.EC2.DescribeFleetInstancesResult = await ec2.describeFleetInstances(params).promise();
        if (fleetInstanceData && fleetInstanceData.ActiveInstances) {
          for (const fleetInstance of fleetInstanceData.ActiveInstances) {
            if (fleetInstance.InstanceId) {
              result.push({
                name: 'Fleet Instance',
                type: FleetInstanceProvider.RESOURCE_TYPE,
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
