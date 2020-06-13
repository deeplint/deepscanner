import { Resource } from 'deeplint/lib/lib/policy/model';
import { StorageManagementClient } from '@azure/arm-storage';
import { AzureProvider } from '../helper/azure-provider';

const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'] || 'f6378f4b-504d-4fa2-bd37-98b88815d3db';

export class StorageAccountProvider extends AzureProvider {
  public static readonly RESOURCE_TYPE = 'azure::storage::account';

  public async collect(context: { [key: string]: any }): Promise<Resource[]> {
    console.log(JSON.stringify(context) + 'context');
    return this.listAllAccounts();
  }

  private async listAllAccounts(): Promise<Resource[]> {
    const result: Resource[] = [];

    try {
      const cred = await this.getCred();
      const client = new StorageManagementClient(cred.credentials, subscriptionId);

      const storageAccounts = await client.storageAccounts.list();
      console.log(JSON.stringify(storageAccounts, null, 4));
    } catch (error) {
      console.log(error);
    }
    return result;
  }
}
