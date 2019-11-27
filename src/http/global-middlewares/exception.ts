/**
 * 兜底格式化未捕获的异常
 */
import { Context, Middleware } from 'koa';

import { NextFn } from '../constant';

export default (): Middleware => {
  return async (ctx: Context, next: NextFn): Promise<any> => {
    try {
      return next();
    } catch (err) {
      return ctx.error(err);
    }
  };
};
