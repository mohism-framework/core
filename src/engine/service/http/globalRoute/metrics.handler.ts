import { IHttpHandler } from '../httpHandler';
import { IMiddleware } from '../../common/IHandler';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { Dict } from '@mohism/utils';
import { HTTP_METHODS } from '../constant';
import { freemem, totalmem, hostname, cpus } from 'os';

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
    const cpu = cpus().reduce((acc, cur) => {
      const { user, sys, idle } = cur.times;
      acc.userAndSys += user + sys;
      acc.total += user + sys + idle;
      return acc;
    }, { userAndSys: 0, total: 0 });
    return {
      hostname: hostname(),
      'memory(%)': Math.floor(100 * (totalmem() - freemem()) / totalmem()),
      'cpu(%)': Math.floor(10000 * (cpu.userAndSys / cpu.total)) / 100,
    };
  }
}

export default new MetricsHandler();