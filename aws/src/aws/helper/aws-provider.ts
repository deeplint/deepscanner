import * as AWS from 'aws-sdk';
import { AwsClientsHelper } from './aws-clients-helper';
import { AWSRegionsHelper } from './aws-region-helper';
import { BaseProvider, toArray } from '@deeplint/deepscanner-base';

export abstract class AwsProvider extends BaseProvider {
  private regions: string[] | undefined;

  public getClient(serviceName: string, region: string): AWS.Service {
    return AwsClientsHelper.getClient(serviceName, region);
  }

  public setRegions(regions: string | string[]): void {
    this.regions = toArray(regions);
  }

  public getRegions(serviceName: string): string[] {
    return this.regions && this.regions.length ? this.regions : AWSRegionsHelper.getServiceRegions(serviceName);
  }
}
