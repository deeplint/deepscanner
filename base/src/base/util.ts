import { Resource } from 'deeplint/lib/lib/policy/model';

export function toArray(obj: string | string[]): string[] {
  if (Array.isArray(obj)) {
    return obj;
  } else {
    return [obj];
  }
}

export function createResource(
  name: string,
  type: string,
  properties: { [key: string]: any },
  meta: { [key: string]: any },
): Resource {
  return { name, type, properties, meta };
}
