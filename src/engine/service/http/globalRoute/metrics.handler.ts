import Simon from '@mohism/simon';
import { Dict } from '@mohism/utils';
import { hostname } from 'os';

import { IMiddleware } from '../../common/IHandler';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_METHODS } from '../constant';
import { IHttpHandler } from '../httpHandler';

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
    const { total: mTotal, used: mUsed } = Simon.memory();
    const { total: dTotal, used: dUsed } = Simon.diskUsed('/');
    return {
      hostname: hostname(),
      'disk(%)': Math.floor(10000 * dUsed / dTotal) / 100,
      'memory(%)': Math.floor(10000 * mUsed / mTotal) / 100,
      'cpu(%)': Simon.cpu(),
    };
  }
}

export default new MetricsHandler();