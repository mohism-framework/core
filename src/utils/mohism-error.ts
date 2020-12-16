import { Dict } from '@mohism/utils';

const DEFAULT_STATUS = 500;
const DEFAULT_SEQ = 0;

export default class MohismError extends Error {
  status: number;
  seq: number;
  detail: string = '';
  constructor(message: string) {
    super(message);
    this.status = DEFAULT_STATUS;
    this.seq = DEFAULT_SEQ;
  }

  /**
   * 指定http状态
   * @param status 0-999
   */
  setStatus(status: number): this {
    this.status = status;
    return this;
  }

  getStatus(): number {
    return this.status;
  }

  /**
   * 指定业务错误序号
   * @param code 0-999
   */
  setSeq(code: number): this {
    this.seq = code;
    return this;
  }

  output(): Dict<any> {
    return {
      status: this.status,
      code: this.seq,
      message: `${this.message}${this.detail && `: ${this.detail}`}`,
    };
  }

  setDetail(text: string) {
    this.detail = text;
    return this;
  }
}