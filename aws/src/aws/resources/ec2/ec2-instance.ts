import * as AWS from 'aws-sdk';
import { Resource } from '@deeplint/deepscanner-base';
import _ = require('lodash');
import { AwsProvider } from '../../helper/aws-provider';
import { handle } from '../../helper/aws-error-handler';

export class EC2InstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::instance';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllInstance(context);
  }

  private async listAllInstance(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);
    try {
      for (const region of regions) {
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const ec2InstanceData: AWS.EC2.DescribeInstancesResult = await ec2.describeInstances().promise();
        if (ec2InstanceData && ec2InstanceData.Reservations) {
          for (const reservations of ec2InstanceData.Reservations) {
            if (reservations.Instances) {
              for (const instance of reservations.Instances) {
                result.push({
                  name: instance.InstanceId ? instance.InstanceId : '',
                  type: EC2InstanceProvider.RESOURCE_TYPE,
                  meta: {
                    region: region,
                  },
                  properties: {
                    ...instance,
                  },
                });
              }
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
