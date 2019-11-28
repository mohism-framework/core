import { Dict } from '@mohism/utils';

import { IApplication } from './src/engine/service/common/IAppliaction';
import { IDefinition } from './src/engine/service/common/param-definition/IDefinition';
import { HTTP_METHODS } from './src/engine/service/http/constant';
import { HttpApplication } from './src/engine/service/http/httpApplication';
import { IHttpHandler } from './src/engine/service/http/IHttpHandler';
import Pick from './src/http/definitions/pick';
import { HTTP_PARAM_LOCATION } from './src/http/constant';
import MohismError from './src/utils/mohism-error';


const fn: IHttpHandler = {
  path: () => '/a/b/c',
  middlewares: () => [],
  method: () => HTTP_METHODS['GET'],
  params: () => {
    return {
      u: Pick('u').in(HTTP_PARAM_LOCATION.QUERY).string(),
      s: Pick('gy').in(HTTP_PARAM_LOCATION.QUERY).boolean(),
    };
  },
  run: async (param) => {
    
    return `It say ${param.u} is ${param.s}`;
  }
};

const a: IApplication = new HttpApplication({
  port: 3333,
  host: '0.0.0.0',
  cors: true,
});

a.mount(fn);

a.listen();