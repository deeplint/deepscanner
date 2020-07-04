import { handle } from '../helper/aws-error-handler';
import * as AWS from 'aws-sdk';
import { AwsProvider } from '../helper/aws-provider';
import { Resource } from '@deeplint/deepscanner-base';

export class AmiImageProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::ami';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllAmiImage();
  }

  private async listAllAmiImage(): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    try {
      for (const region of this.getRegions(serviceName)) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const params = {
          ImageIds: [
            "ami-5731123e"
         ]
        };
        const amiImageData: AWS.EC2.DescribeImagesResult = await ec2.describeImages(params).promise();
        if (amiImageData && amiImageData.Images) {
          for (const amiImage of amiImageData.Images) {
            if (amiImage.Architecture) {
              result.push({
                name: amiImage.Name ? amiImage.Name : '',
                type: AmiImageProvider.RESOURCE_TYPE,
                properties: {
                  Region: region,
                  Description: amiImage.Description,
                  Architecture: amiImage.Architecture,
                  ImageId: amiImage.ImageId,
                  ImageType: amiImage.ImageType,
                  KernelId: amiImage.KernelId,
                  RootDeviceType: amiImage.RootDeviceType,
                  RootDeviceName: amiImage.RootDeviceName
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
