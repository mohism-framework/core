import { Dict } from '@mohism/utils';

import { IMiddleware } from '../../common/IHandler';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_METHODS } from '../constant';
import { AHttpHandler } from '../httpHandler';

class HealthHandler implements AHttpHandler {
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

  description(): string {
    return 'health check with http';
  }

  path(): string {
    return '/_health';
  }

  async run(): Promise<any> {
    return {};
  }
}

export default new HealthHandler();