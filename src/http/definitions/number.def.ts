import { Dict } from '@mohism/utils';
import { IDefinition } from './iDefinition';
import CommonDefinition from './common.def';

export default class NumberDefinition extends CommonDefinition implements IDefinition {
  data: Dict<any>;

  constructor(newData?: Dict<any>) {
    super(newData);
    this.data = newData || {} as Dict<any>;
  }

  /**
   * 大于
   * @param {number} n 
   */
  gt(n: number): this {
    this.data.range = this.data.range || {} as Dict<Dict<any>>;
    this.data.range.min = {
      n,
      e: false,
    };
    return this;
  }

  /**
   * 大于等于
   * @param {number} n 
   */
  gte(n: number): this {
    this.data.range = this.data.range || {} as Dict<Dict<any>>;
    this.data.range.min = {
      n,
      e: true,
    };
    return this;
  }
  /**
   * 小于
   * @param {number} n 
   */
  lt(n: number): this {
    this.data.range = this.data.range || {} as Dict<Dict<any>>;
    this.data.range.max = {
      n,
      e: false,
    };
    return this;
  }
  /**
   * 小于等于
   * @param {number} n 
   */
  lte(n: number): this {
    this.data.range = this.data.range || {} as Dict<Dict<any>>;
    this.data.range.max = {
      n,
      e: true,
    };
    return this;
  }
}