import { IHttpHandler } from '../IHttpHandler';
import { IMiddleware } from '../../common/IHandler';
import { Dict } from '@mohism/utils';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_METHODS } from '../constant';

class HealthHandler implements IHttpHandler {
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
    return 'health check';
  }

  path(): string {
    return '/_health';
  }

  async run(): Promise<any> {
    return {};
  }
}

export default new HealthHandler();