import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class SpotInstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::spotfleet';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllSpotInstance();
  }

  private async listAllSpotInstance(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const params = {
          SpotFleetRequestId: "SPOT_INSTANCE_ID" /* required */
        };
        const spotInstanceData: AWS.EC2.DescribeSpotFleetInstancesResponse = await ec2.describeSpotFleetInstances(params).promise();
        if (spotInstanceData && spotInstanceData.ActiveInstances) {
          for (const spotInstance of spotInstanceData.ActiveInstances) {
            if (spotInstance.InstanceId) {
              result.push({
                name: 'Spot Instance',
                type: SpotInstanceProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  ...spotInstance,
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
