import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class VPCProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::vpc';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllVpc();
  }

  private async listAllVpc(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const vpcsData: AWS.EC2.DescribeVpcsResult = await ec2.describeVpcs().promise();
        if (vpcsData && vpcsData.Vpcs) {
          for (const vpc of vpcsData.Vpcs) {
            if (vpc.CidrBlock) {
              result.push({
                name: 'VPC',
                type: VPCProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  CidrBlock: vpc.CidrBlock,
                  DhcpOptionsId: vpc.DhcpOptionsId,
                  VpcId: vpc.VpcId,
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
