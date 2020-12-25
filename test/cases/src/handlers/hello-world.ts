
import { Dict } from '@mohism/utils';
import { AHttpHandler, HttpPick, HTTP_METHODS, HTTP_PARAM_LOCATION, IDefinition, IMiddleware } from '../../../../src';

import auth from '../middlewares/auth';

const { GET } = HTTP_METHODS;
const { QUERY } = HTTP_PARAM_LOCATION;

class HelloWorld extends AHttpHandler {
  middlewares(): Array<IMiddleware> {
    return [auth];
  }
  params(): Dict<IDefinition> {
    return {
      err: HttpPick('err').in(QUERY).boolean().default(false),
    };
  }

  method(): HTTP_METHODS {
    return GET;
  }

  name(): string {
    return '你好，世界。';
  }

  path(): string {
    return '/hello';
  }

  async run(params: Dict<any>): Promise<any> {
    return params;
  }
}

export default new HelloWorld();
