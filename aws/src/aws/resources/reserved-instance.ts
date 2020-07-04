import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class ReservedInstanceProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::ri';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllReservedInstances();
  }

  private async listAllReservedInstances(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const riData: AWS.EC2.DescribeReservedInstancesResult = await ec2.describeReservedInstances().promise();
        if (riData && riData.ReservedInstances) {
          for (const reservedInstance of riData.ReservedInstances) {
            if (reservedInstance.ReservedInstancesId) {
              result.push({
                name: 'Reserved Instances',
                type: ReservedInstanceProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  ReservedInstancesId: reservedInstance.ReservedInstancesId,
                  InstanceType: reservedInstance.InstanceType,
                  InstanceTenancy: reservedInstance.InstanceTenancy,
                  OfferingType: reservedInstance.OfferingType
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
