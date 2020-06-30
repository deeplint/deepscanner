import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class EC2InstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::instance';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllInstance();
  }

  private async listAllInstance(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const ec2InstanceData: AWS.EC2.DescribeInstancesResult = await ec2.describeInstances().promise();
        console.log(ec2InstanceData);
        if (ec2InstanceData && ec2InstanceData.Reservations) {
          for (const reservations of ec2InstanceData.Reservations) {
            if (reservations.Instances) {
              result.push({
                name: reservations.Instances[0].KeyName ? reservations.Instances[0].KeyName : '',
                type: EC2InstanceProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  InstanceType: reservations.Instances[0].InstanceType,
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
