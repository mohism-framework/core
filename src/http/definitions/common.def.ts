import { Dict } from '@mohism/utils';
import { IDefinition } from './iDefinition';

export default class CommonDefinition implements IDefinition {
  data: Dict<any>;
  constructor(newData?: Dict<any>) {
    this.data = newData || {} as Dict<any>;
  }

  not(options: Array<any>): this {
    this.data.excludes = options;
    return this;
  }

  isIn(options: Array<any>): this {
    this.data.choices = options;
    return this;
  }

  default(value: any): this {
    this.data.default = value;
    this.data.optional = true;
    return this;
  }

  required(): this {
    this.data.required = true;
    return this;
  }
}


