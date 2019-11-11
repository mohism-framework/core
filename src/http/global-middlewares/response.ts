import { Context, Middleware } from 'koa';
import { MohismConf, UnifiedResponse } from '../../utils/global-type';
import MohismErr from '../../utils/mohism-error';
import { resolve } from 'path';

const mohismConf: MohismConf = require(resolve(`${process.cwd()}/mohism.json`));
/**
 * 为context加载response方法
 *
 */
export default (): Middleware => {
  return async (ctx: Context, next: () => Promise<any>): Promise<any> => {
    const { appId = 1000 } = mohismConf;
    ctx.success = (data: any) => {
      const body: UnifiedResponse = {
        code: 0,
        message: 'success',
        data,
      };
      ctx.body = body;
    };

    ctx.error = (err: MohismErr | Error | UnifiedResponse | any, extra: any = {}) => {
      let specStatus = 500;
      if (err.status) {
        specStatus = err.status;
        err = {
          code: err.status * 1e3,
          message: `${err.name}:${err.message}`,
          stack: err.stack,
        };
      } else if (err instanceof Error) {
        err = {
          code: 500000,
          message: `${err.name}:${err.message}`,
          stack: err.stack,
        };
      }
      err.extra = extra;
      ctx.status = specStatus;
      ctx.body = {
        code: appId * 1e6 + err.code,
        message: err.message,
        data: err.extra,
      };
    };
    return next();
  };
};


