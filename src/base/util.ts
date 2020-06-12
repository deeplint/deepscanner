export function toArray(obj: string | string[]): string[] {
  if (Array.isArray(obj)) {
    return obj;
  } else {
    return [obj];
  }
}
