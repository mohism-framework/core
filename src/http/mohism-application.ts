import { rightpad } from '@mohism/utils';
import { rainbow } from 'colors';
import cors from 'kcors';
import Koa, { Middleware } from 'koa';
import body from 'koa-bodyparser';
import { EOL } from 'os';

import { HTTP_METHODS } from './constant';
import exception from './global-middlewares/exception';
import globalRouter from './global-middlewares/global-router';
import response from './global-middlewares/response';
import IHandler, { magicMount } from './iHandler';

export default class MohismApplication {
  koa: Koa;
  middlewares: Array<Middleware>;
  handlers: Array<IHandler>;
  constructor() {
    this.koa = new Koa();
    // default middlers
    this.koa
      .use(cors())
      .use(body())
      .use(response())
      .use(exception());

    this.middlewares = [] as Array<Middleware>;
    this.handlers = [] as Array<IHandler>;
  }

  use(middlewares: Array<Middleware> | Middleware): this {
    if (Array.isArray(middlewares)) {
      this.middlewares = this.middlewares.concat(middlewares);
    } else {
      this.middlewares = this.middlewares.concat([middlewares]);
    }
    return this;
  }

  mount(handler: IHandler): this {
    this.handlers.push(handler);
    return this;
  }

  verbose(): void {
    const colorFy = (str: string): string => {
      const h = str.substr(0, 3);
      switch (h) {
      case 'GET':
        return str.green;
      case 'POS':
        return str.blue;
      case 'PUT':
        return str.cyan;
      case 'DEL':
        return str.red;
      case 'HEA':
      case 'OPT':
        return str.white;
      default:
        return str.grey;
      }
    };
    const outputs: Array<string> = [];
    outputs.push('');
    outputs.push(rainbow('Mohism!'));
    // outputs.push(`${rightpad('method', 16)}${rightpad('path', 24)}${rightpad('desc', 24)}`.yellow);
    this.handlers.forEach((handler: IHandler): void => {
      outputs.push(`${colorFy(rightpad(HTTP_METHODS[handler.method()], 16))}${rightpad(`${handler.group()}${handler.path()}`, 24)}${colorFy(rightpad(handler.name(), 24))}`.white);
    });
    console.log(outputs.join(EOL));
  }

  start(port: number): void {
    // bind middlewares
    this.middlewares.forEach((mid: Middleware): void => {
      this.koa.use(mid);
    });

    // mounted routes here
    this.handlers.forEach((handler: IHandler): void => {
      magicMount(globalRouter, handler);
    });

    this.koa.use(globalRouter.routes());

    this.koa.listen(port);
  }
}