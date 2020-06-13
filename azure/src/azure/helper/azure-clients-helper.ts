import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';
import { AuthResponse } from '@azure/ms-rest-nodeauth';

export class AzureClientsHelper {
  static authResponse: AuthResponse | undefined;
  public static async getAuthResponse(): Promise<AuthResponse> {
    const clientId = process.env['AZURE_CLIENT_ID'] || '';
    const secret = process.env['AZURE_APPLICATION_SECRET'] || '';
    const tenantId = process.env['AZURE_DOMAIN'] || '';
    if (AzureClientsHelper.authResponse) {
      return AzureClientsHelper.authResponse;
    }
    try {
      AzureClientsHelper.authResponse = await msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
        clientId,
        secret,
        tenantId,
      );
      return AzureClientsHelper.authResponse;
    } catch (error) {
      throw new Error('Azure authentication failure');
    }
  }
}
