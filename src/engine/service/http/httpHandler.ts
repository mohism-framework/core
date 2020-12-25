import { Dict } from '@mohism/utils';

import { IHandler, IMiddleware } from '../common/IHandler';
import { IDefinition } from '../common/param-definition/IDefinition';
import { HTTP_METHODS } from './constant';
import BaseApplication from './abstractApplication';
import { IContext } from './paramParser/IContext';
import { validate } from './validate';


/**
 * 扩展了接口handler类型，强调是通过http协议接入(另一种可能的接入是 grpc)
 * 所以扩展了一些信息，比如 
 * - rawResponse 是否返回原始信息，默认是否，会包裹在 {code,msg,data}结构里
 * - method 因为是http实现，所以要补充描述 HTTP_METHODS
 */
export interface IHttpHandler extends IHandler {
  rawResponse?: boolean;
  method(): HTTP_METHODS;
}

/**
 * 直面开发者，我们提供一个抽象类好了
 * IHttpHandler 的抽象实现，现在还没有太多实现的部分
 * 
 */
export abstract class AHttpHandler implements IHttpHandler {
  rawResponse?: boolean = false;
  app?: BaseApplication;
  ctx?: IContext | undefined;
  name(): string {
    return '';
  }

  method(): HTTP_METHODS {
    return HTTP_METHODS.GET;
  }

  path(): string {
    return '/';
  }

  params(): Dict<IDefinition> {
    return {};
  }

  middlewares(): Array<IMiddleware> {
    return [];
  }

  abstract run(params?: Dict<any>): Promise<any>;
}

export const runHandler = async (context: IContext, handler: IMiddleware | IHandler): Promise<any> => {
  const middleware = (handler as IHandler)?.middlewares() || [];
  if (middleware.length > 0) {
    for (let i = 0; i < middleware.length; i++) {
      const params = validate(context, middleware[i].params());
      middleware[i].ctx = context;
      await middleware[i].run(params);
      middleware[i].ctx = undefined;
    }
  }
  const params = validate(context, handler.params());
  handler.ctx = context;
  const result = await handler.run(params);
  handler.ctx = undefined;
  return result;
};