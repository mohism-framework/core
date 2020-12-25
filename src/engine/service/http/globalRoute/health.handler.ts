import { Dict } from '@mohism/utils';

import { IMiddleware } from '../../common/IHandler';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_METHODS } from '../constant';
import { AHttpHandler } from '../httpHandler';

class HealthHandler extends AHttpHandler {
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