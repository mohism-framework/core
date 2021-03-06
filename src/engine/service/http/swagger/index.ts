import { ISwagger, ISwaggerParamBase, ISwaggerRouter } from './type';
import { getConfig, def2params } from './func';
import scanHandler from '../faas/scanHandler';
import { join } from 'path';
import { IHttpHandler } from '../httpHandler';
import { HTTP_METHODS } from '../constant';


export const genSwagger = (path: string = process.cwd()): ISwagger => {
  const conf = getConfig(path);
  const swagger: ISwagger = {
    swagger: '2.0',
    info: {
      title: conf.name || '',
      description: conf.description || '',
      version: conf.version || '0.0.0',
      appId: conf.appId || '0000',
    },
    host: `${conf.httpConf.host}:${conf.httpConf.port}` || '127.0.0.1:3000',
    basePath: conf.httpConf.prefix || '',
    tags: [],
    schemes: ['http'],
    definitions: {},
    paths: {},
  };
  const handlers = scanHandler(join(conf.projectRoot, 'src'));

  handlers.forEach((handler: IHttpHandler) => {
    const [
      url,
      method,
    ] = [
        handler.path(),
        HTTP_METHODS[handler.method()].toLowerCase(),
      ];

    let parameters: Array<ISwaggerParamBase> = [];

    const middlewares = handler.middlewares();
    if (middlewares.length) {
      middlewares.forEach(middleware => {
        parameters = [
          ...parameters,
          ...def2params(middleware.params()),
        ];
      });
    }
    
    parameters = [
      ...parameters,
      ...def2params(handler.params()),
    ];

    swagger.paths[url] = swagger.paths[url] || {};
    const route = {
      tags: [],
      summary: handler.name ? handler.name() : 'no summary',
      description: handler.description ? handler.description() : 'no description',
      operationId: '',
      consumes: ['application/json'],
      prodcues: ['application/json'],
      parameters,
      responses: {},
    };
    swagger.paths[url][method] = route as ISwaggerRouter;
  });
  return swagger;
};