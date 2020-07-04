import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class SubnetProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::subnet';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllSubnet();
  }

  private async listAllSubnet(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const subnetssData: AWS.EC2.DescribeSubnetsResult = await ec2.describeSubnets().promise();
        if (subnetssData && subnetssData.Subnets) {
          for (const subnet of subnetssData.Subnets) {
            if (subnet.SubnetId) {
              result.push({
                name: 'SUBNET',
                type: SubnetProvider.RESOURCE_TYPE,
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
