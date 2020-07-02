import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class EIPProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::eip';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllAddresses();
  }

  private async listAllAddresses(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const eipAddressData: AWS.EC2.DescribeAddressesResult = await ec2.describeAddresses().promise();
        if (eipAddressData && eipAddressData.Addresses) {
          for (const address of eipAddressData.Addresses) {
            if (address.PublicIp) {
              result.push({
                name: 'Elastic IP addresse',
                type: EIPProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  PublicIp: address.PublicIp,
                  AllocationId: address.AllocationId,
                  NetworkBorderGroup: address.NetworkBorderGroup,
                  PublicIpv4Pool: address.PublicIpv4Pool,
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
