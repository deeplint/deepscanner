import { AzureClientsHelper } from './azure-clients-helper';
import { AuthResponse } from '@azure/ms-rest-nodeauth';
import { BaseProvider, toArray } from '@deeplint/deepscanner-base';

export abstract class AzureProvider extends BaseProvider {
  private subscriptions: string[] | undefined;

  public async getCred(): Promise<AuthResponse> {
    return AzureClientsHelper.getAuthResponse();
  }

  public setSubscriptions(subscriptions: string | string[]): void {
    this.subscriptions = toArray(subscriptions);
  }

  public getSubscriptions(): string[] {
    return this.subscriptions && this.subscriptions.length
      ? this.subscriptions
      : [process.env['AZURE_SUBSCRIPTION_ID'] || ''];
  }
}
