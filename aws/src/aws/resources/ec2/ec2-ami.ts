import * as AWS from 'aws-sdk';
import { Resource } from '@deeplint/deepscanner-base';
import { AwsProvider } from '../../helper/aws-provider';
import { handle } from '../../helper/aws-error-handler';
import _ = require('lodash');

export class EC2AmiProvider extends AwsProvider {
  public static readonly RESOURCE_TYPE = 'aws::ec2::ami';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(context);
    return this.listAllAmiImage(context);
  }

  private async listAllAmiImage(context: { [key: string]: any }): Promise<Resource[]> {
    const result: Resource[] = [];
    const serviceName = 'EC2';
    const regions = _.has(context, 'inputs.regions') ? context.inputs.regions : this.getRegions(serviceName);

    try {
      for (const region of regions) {
        AWS.config.update({ region: region });
        const ec2 = this.getClient(serviceName, region) as AWS.EC2;
        const params = {};
        const amiImageData: AWS.EC2.DescribeImagesResult = await ec2.describeImages(params).promise();
        if (amiImageData && amiImageData.Images) {
          for (const amiImage of amiImageData.Images) {
            if (amiImage.Architecture) {
              result.push({
                name: amiImage.Name ? amiImage.Name : '',
                type: EC2AmiProvider.RESOURCE_TYPE,
                meta: {
                  region: region,
                },
                properties: {
                  ...amiImage,
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
