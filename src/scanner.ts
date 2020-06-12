import { Resource } from 'deeplint/lib/lib/policy/model';
import _ = require('lodash');
import { AWSResourceMap } from './aws';

const ResourceMap = _.merge(AWSResourceMap);
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
