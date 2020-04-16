import { Dict } from '@mohism/utils';

import { HttpApplication } from './httpApplication';
import { IHttpHandler } from './httpHandler';
import { Parser } from './paramParser';
import { IContext, IIncoming } from './paramParser/IContext';
import { validate } from './validate';

const EmptyIncome: IIncoming = {
  url: '',
  body: '',
  headers: {},
  method: '',
};

class HttpTestKit {
  private inc: Dict<string|Dict<any>>;
  constructor() {
    this.inc = {};
  }
  GET(): this {
    this.inc.method = 'GET';
    return this;
  }
  POST(): this {
    this.inc.method = 'POST';
    return this;
  }
  PUT(): this {
    this.inc.method = 'PUT';
    return this;
  }
  DELETE(): this {
    this.inc.method = 'DELETE';
    return this;
  }
  HEAD(): this {
    this.inc.method = 'HEAD';
    return this;
  }

  headers(h: Dict<any>): this {
    this.inc.headers = h;
    return this;
  }

  body(b: Dict<any>): this {
    this.inc.body = JSON.stringify(b);
    return this;
  }

  url(u: string): this {
    this.inc.url = u;
    return this;
  }

  toInc(): IIncoming {
    return { ...EmptyIncome, ...this.inc } as IIncoming;
  }

  /**
   * 运行测试
   * @param app {HttpApplication}
   */
  async run(app: HttpApplication): Promise<any> {
    const inc: IIncoming = this.toInc();
    const ctx: IContext = Parser(inc);
    const handler: IHttpHandler = app.fetch(inc.method, ctx.path) as IHttpHandler;
    const params = validate(ctx, handler.params());
    return handler.run(params);
  }
}

export default HttpTestKit;