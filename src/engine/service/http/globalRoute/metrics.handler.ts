import { IHttpHandler } from '../IHttpHandler';
import { IMiddleware } from '../../common/IHandler';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { Dict } from '@mohism/utils';
import { HTTP_METHODS } from '../constant';
import { freemem, totalmem, loadavg, hostname } from 'os';

class MetricsHandler implements IHttpHandler {
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
    return 'metrics';
  }

  path(): string {
    return '/_metrics';
  }

  async run(): Promise<any> {
    return {
      hostname: hostname(),
      'memory(%)': Math.floor(100 * freemem() / totalmem()),
      loadavg: loadavg(),
    };
  }
}

export default new MetricsHandler();