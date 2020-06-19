import { Resource } from 'deeplint/lib/lib/policy/model';
import { SubscriptionClient } from '@azure/arm-subscriptions';
import { AzureProvider } from '../helper/azure-provider';
import { createResource } from '@deeplint/deepscanner-base';

export class SubscriptionProvider extends AzureProvider {
  public static readonly RESOURCE_TYPE = 'azure::subscription';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(JSON.stringify(context) + 'context');
    return this.listAllSubscriptions();
  }

  private async listAllSubscriptions(): Promise<Resource[]> {
    const result: Resource[] = [];

    try {
      const cred = await this.getCred();
      const client = new SubscriptionClient(cred.credentials);

      const subs = await client.subscriptions.list();
      subs.forEach((sub) => {
        if (sub.subscriptionId) {
          result.push(createResource(sub.subscriptionId, SubscriptionProvider.RESOURCE_TYPE, sub, {}));
        }
      });
    } catch (error) {
      console.log(error);
    }
    return result;
  }
}
