import { Logger, rightpad } from '@mohism/utils';
import { blue, green, grey, yellow } from 'colors';
import { existsSync, readdirSync, statSync } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { extname, resolve } from 'path';

import { unifiedError } from '../common/error-handler';
import { IHandler } from '../common/IHandler';
import BaseApplication from './abstractApplication';
import { HTTP_METHODS, HttpConf } from './constant';
import { Health, Metrics, Swagger } from './globalRoute';
import { AHttpHandler, IHttpHandler, runHandler } from './httpHandler';
import { Parser } from './paramParser';
import { IContext, IIncoming } from './paramParser/IContext';
import { colorfy, Router } from './router';
import { HTTP_STATUS } from './statusCode';
import { resStringify } from './utils';

const PAD: number = 8;

export class HttpApplication extends BaseApplication {

  private router: Router;

  constructor(config: HttpConf, basePath: string) {
    super(config, basePath);
    if (process.env.NODE_ENV === 'production') {
      // force 'verbose' to false, for perfermence reason
      this.config = { ...this.config, verbose: false };
    }

    this.router = new Router();
  }

  public fetch(method: string, url: string): IHttpHandler | IHandler | undefined {
    return this.router.fetch(method, url);
  }

  private listen(): void {
    const { port = 3000, host = '0.0.0.0', cors = true } = this.config;
    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (cors) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
        res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS,HEAD');
      }
      const rawbody: Array<any> = [];
      req.on('data', (chunk: any) => {
        rawbody.push(chunk);
      });
      req.on('end', () => {
        res.setHeader('content-type', 'application/json');
        const inc: IIncoming = {
          url: req.url as string,
          body: rawbody.join(''),
          headers: req.headers,
          method: req.method as string,
        };

        try {
          const context: IContext = Parser(inc);
          const handler: IHttpHandler = this.fetch(inc.method, context.path) as IHttpHandler;
          runHandler(context,handler).then((v: any) => {
            const response = {
              code: 0,
              data: v,
              message: 'ok',
            }
            res.end(resStringify(response));
            if (this.config.verbose) {
              Logger.info(`[${green('200')}] ${rightpad(inc.method, PAD)} ${context.path}`);
            }
          }).catch(e => {
            res.statusCode = e.status || HTTP_STATUS.InternalServerError;
            res.end(resStringify(unifiedError(e)));
            if (this.config.verbose) {
              Logger.info(`[${yellow(`${res.statusCode}`)}] ${rightpad(inc.method, PAD)} ${context.path}`);
            }
          });

        } catch (e) {
          res.statusCode = e.status || HTTP_STATUS.InternalServerError;
          res.end(resStringify(unifiedError(e)));
          if (this.config.verbose) {
            Logger.info(`[${yellow(`${res.statusCode}`)}] ${rightpad(inc.method, PAD)} ${inc.url}`);
          }
        }
      });
    });
    this.server.listen(port, host);
    Logger.info(`Listen on ${host}:${port}`);
  }

  mount(handler: IHttpHandler): void {
    handler.app = this;
    const path: string = handler.path();
    this.router.register(handler.method(), path, handler);
    console.log(`${rightpad(colorfy(HTTP_METHODS[handler.method()]), 16)}${rightpad(handler.path(), 32)}${grey(handler.name())}`);
  }

  scanHandler() {
    const handlerPath = resolve(this.basePath, 'handlers');
    if (existsSync(handlerPath) && statSync(handlerPath).isDirectory()) {
      readdirSync(handlerPath).forEach((file: string) => {
        if (!statSync(`${handlerPath}/${file}`).isDirectory()
          && ['.ts', '.js'].includes(extname(file))) {
          const handler = require(`${handlerPath}/${file}`.replace(extname(file), '')).default;
          if (handler instanceof AHttpHandler) {
            this.mount(handler);
          }
        }
      });
    }

  }

  async boot() {
    // mount global route
    this.mount(Health);
    this.mount(Swagger);
    this.mount(Metrics);
    this.scanHandler();
    this.listen();
    if (process.env.NODE_ENV !== 'production') {
      const { host, port } = this.config;
      Logger.info(`See: ${blue(`http://${host}:${port}/_swagger`)}`);
    }
  }

}