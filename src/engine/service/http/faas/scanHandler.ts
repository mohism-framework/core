import { Dict } from '@mohism/utils';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { extname, resolve } from 'path';

import { HTTP_METHODS } from '../constant';
import { AHttpHandler, IHttpHandler } from '../httpHandler';
import paramDef from './ast/paramDef';
import { transform } from './transform';

/**
 * @param srcPath {string} src目录，也就是boot.ts所在目录
 */
/* istanbul ignore next */
export default (srcPath: string, withComment = false): Array<IHttpHandler> => {
  const handlerPath = resolve(srcPath, 'handlers');

  const result: IHttpHandler[] = [];
  if (existsSync(handlerPath) && statSync(handlerPath).isDirectory()) {
    readdirSync(handlerPath).forEach((file: string) => {
      if (!statSync(`${handlerPath}/${file}`).isDirectory()
        && ['.ts', '.js'].includes(extname(file))) {
        if (file.endsWith('.d.ts')) {
          return;
        }
        const handler = require(`${handlerPath}/${file}`.replace(extname(file), ''));
        if (handler.default instanceof AHttpHandler) {
          result.push(handler.default);
        } else if (typeof handler.default === 'function') {
          const codes = readFileSync(`${handlerPath.replace('dist', 'src')}/${file.replace('.js', '.ts')}`).toString();
          const [defs, comment] = paramDef(codes);
          const autoParams = transform(defs, handler.method || HTTP_METHODS.GET);
          if (handler.params) {
            for (let field in handler.params) {
              if (!autoParams[field]) {
                continue;
              }
              // comment
              if (withComment) { }
              autoParams[field] = {
                ...autoParams[field],
                ...handler.params[field],
              };
            }
          }
          const ObjectHandler = {
            ctx: undefined,
            rawResponse: handler.rawResponse || false,
            path: () => (handler.path || `/${file.split('.')[0]}`),
            params: () => autoParams,
            middlewares: () => (handler.middlewares || []),
            name: () => (comment.comment || handler.name || file),
            description: () => (comment.comment || handler.name || file),
            method: () => (handler.method || HTTP_METHODS.GET),
            run: async (params: Dict<any>) => {
              const args = defs.map(def => params[def.name]);
              if (ObjectHandler.ctx) {
                args.push(ObjectHandler.ctx);
              }
              return handler.default(...args)
            },
          };
          result.push(ObjectHandler);
        }
      }
    });
  }
  return result;
};