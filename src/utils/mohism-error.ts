import { Dict } from '@mohism/utils';

const DEFAULT_STATUS = 500;

export default class MohismError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = DEFAULT_STATUS;
  }

  statusCode(status: number): this {
    this.status = status;
    return this;
  }

  output(): Dict<any> {
    return {
      status: this.status,
      message: this.message,
    };
  }
}