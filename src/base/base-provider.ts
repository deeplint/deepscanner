import { Resource } from 'deeplint/lib/lib/policy/model';

export abstract class BaseProvider {
  public abstract async collect(context: { [key: string]: any }): Promise<Resource[]>;
}
