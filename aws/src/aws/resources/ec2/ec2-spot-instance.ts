import * as AWS from 'aws-sdk';
import { Resource } from '@deeplint/deepscanner-base';
import { AwsProvider } from '../../helper/aws-provider';
import { handle } from '../../helper/aws-error-handler';
import _ = require('lodash');

export class EC2SpotInstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::spot';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllSpotInstance(context);
  }

  private async listAllSpotInstance(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const params = {
          SpotFleetRequestId: 'SPOT_INSTANCE_ID' /* required */,
        };
        const spotInstanceData: AWS.EC2.DescribeSpotFleetInstancesResponse = await ec2
          .describeSpotFleetInstances(params)
          .promise();
        if (spotInstanceData && spotInstanceData.ActiveInstances) {
          for (const spotInstance of spotInstanceData.ActiveInstances) {
            if (spotInstance.InstanceId) {
              result.push({
                name: 'Spot Instance',
                type: EC2SpotInstanceProvider.RESOURCE_TYPE,
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
