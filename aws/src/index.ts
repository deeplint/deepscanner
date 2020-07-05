import _ = require('lodash');
import { AWSResourceMap } from './aws';
import { Resource } from '@deeplint/deepscanner-base';

const ResourceMap = _.merge(AWSResourceMap);

export async function scan(context: { [key: string]: any }): Promise<Resource[]> {
  let res: Resource[] = [];
  await Promise.all(
    Object.keys(ResourceMap).map(async (key) => {
      if (_.has(context, 'inputs.resourceTypes')) {
        const resourceTypes = context.inputs.resourceTypes;
        for (const resourceType of resourceTypes) {
          const temp = await ResourceMap[resourceType].instance.collect(context);
          res = res.concat(temp);
        }
      } else if (_.has(context, 'inputs.services')) {
        if (context.inputs.services.includes(ResourceMap[key].service)) {
          const temp = await ResourceMap[key].instance.collect(context);
          res = res.concat(temp);
        }
      } else {
        const temp = await ResourceMap[key].instance.collect(context);
        res = res.concat(temp);
      }
    }),
  );
  return res;
}
