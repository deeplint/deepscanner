import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class EBStoreProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ebs::volume';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllVolume();
  }

  private async listAllVolume(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const ebsVolumesData: AWS.EC2.DescribeVolumesResult = await ec2.describeVolumes().promise();
        if (ebsVolumesData && ebsVolumesData.Volumes) {
          for (const volume of ebsVolumesData.Volumes) {
            if (volume.SnapshotId) {
              result.push({
                name: volume.SnapshotId,
                type: EBStoreProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  AvailabilityZone: volume.SnapshotId,
                  SnapshotId: volume.SnapshotId,
                  Size: volume.Size,
                  VolumeId: volume.VolumeId,
                  VolumeType: volume.VolumeType,
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
