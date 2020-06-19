import _ = require('lodash');
import { AzureResourceMap } from './azure';
import { Resource } from '@deeplint/deepscanner-base';

const ResourceMap = _.merge(AzureResourceMap);
export async function scan(context: { [key: string]: any }): Promise<Resource[]> {
  let res: Resource[] = [];
  await Promise.all(
    Object.keys(ResourceMap).map(async (key) => {
      const temp = await ResourceMap[key].collect(context);
      res = res.concat(temp);
    }),
  );
  return res;
}
