import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';
import _ = require('lodash');

export class EBSVolumeProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ebs::volume';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    return this.listAllVolume(context);
  }

  private async listAllVolume(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'regions') ? context.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const ebsVolumesData: AWS.EC2.DescribeVolumesResult = await ec2.describeVolumes().promise();
        if (ebsVolumesData && ebsVolumesData.Volumes) {
          for (const volume of ebsVolumesData.Volumes) {
            if (volume.VolumeId) {
              result.push({
                name: volume.VolumeId,
                type: EBSVolumeProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  ...volume,
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
