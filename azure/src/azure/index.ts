import { StorageAccountProvider } from './resources/storage-account';
import { BaseProvider } from '@deepscanner/base';

export const AzureResourceMap: { [key: string]: BaseProvider } = {
  [StorageAccountProvider.RESOURCE_TYPE]: new StorageAccountProvider(),
};
