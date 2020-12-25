import { Dict } from '@mohism/utils';

import { IHandler, IMiddleware } from '../common/IHandler';
import { IDefinition } from '../common/param-definition/IDefinition';
import { HTTP_METHODS } from './constant';
import BaseApplication from './abstractApplication';
import { IContext } from './paramParser/IContext';
import { validate } from './validate';


export interface IHttpHandler extends IHandler {
  rawResponse?: boolean;
  app?: BaseApplication;
  method(): HTTP_METHODS;
}

// Abstract
export abstract class AHttpHandler implements IHttpHandler {
  rawResponse?: boolean = false;
  app?: BaseApplication;
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
      await middleware[i].run(params);
    }
  }
  const params = validate(context, handler.params());
  return handler.run(params);
};