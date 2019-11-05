import { Dict } from '@mohism/utils';
import CommonDefinition from './common.def';
import { IDefinition } from './iDefinition';

export default class StringDefinition extends CommonDefinition implements IDefinition {
  data: Dict<any>;

  constructor(newData?: Dict<any>) {
    super(newData);
    this.data = newData || {} as Dict<any>;
  }

  /**
   * 字符串长度限制
   * @param {number} min 
   * @param {number} max 
   */
  length(min: number = 0, max: number = Number.MAX_SAFE_INTEGER): this {
    this.data.length = [min, max];
    return this;
  }

  contains(char: string): this {
    this.data.contains = char;
    return this;
  }
}