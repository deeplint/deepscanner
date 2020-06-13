import { AWSError } from 'aws-sdk';

export function handle(error: AWSError, ...params: any[]): Error | undefined {
  const errorCode = error.code;
  if (
    errorCode === 'OptInRequired' ||
    errorCode === 'SubscriptionRequiredException' ||
    errorCode === 'InvalidClientTokenId' ||
    errorCode === 'AuthFailure' ||
    errorCode === 'UnrecognizedClientException' ||
    errorCode === 'NoSuchEntity'
  ) {
    return;
  }
  throw makeError(error, params);
}

function makeError(error: AWSError, params: any[]): Error {
  if (params && params.length) {
    return new Error(error.code + ':' + error.message + ' ' + JSON.stringify(params, null, 2));
  }
  return error;
}
