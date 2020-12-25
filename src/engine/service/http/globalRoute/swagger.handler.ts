import { Dict } from '@mohism/utils';

import { IMiddleware } from '../../common/IHandler';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_METHODS } from '../constant';
import { IHttpHandler } from '../httpHandler';
import { genSwagger } from '../swagger';


class SwaggerHandler implements IHttpHandler {
  rawResponse = true;
  middlewares(): Array<IMiddleware> {
    return [];
  }

  params(): Dict<IDefinition> {
    return {};
  }

  method(): HTTP_METHODS {
    return HTTP_METHODS.GET;
  }

  name(): string {
    return 'swagger api';
  }

  path(): string {
    return '/_swagger';
  }

  async run(): Promise<any> {
    return JSON.stringify(genSwagger(process.cwd()));
  }
}

export default new SwaggerHandler();