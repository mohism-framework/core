import { Logger, rightpad } from '@mohism/utils';
import { blue, green, grey, yellow } from 'colors';
import { createServer, IncomingMessage, ServerResponse } from 'http';

import { unifiedError } from '../common/error-handler';
import { IHandler } from '../common/IHandler';
import BaseApplication from './abstractApplication';
import { HTTP_METHODS, HttpConf } from './constant';
import scanHandler from './faas/scanHandler';
import { Health, Metrics, Swagger } from './globalRoute';
import { IHttpHandler, runHandler } from './httpHandler';
import { Parser } from './paramParser';
import { IContext, IIncoming } from './paramParser/IContext';
import { colorfy, Router } from './router';
import { HTTP_STATUS } from './statusCode';
import { resStringify } from './utils';

const logger = Logger();

const PAD: number = 8;

export class HttpApplication extends BaseApplication {

  private router: Router;

  constructor(config: HttpConf, basePath: string) {
    super(config, basePath);
    if (process.env.NODE_ENV === 'production') {
      // force 'verbose' to false, for perfermence reason
      this.config = { ...this.config, verbose: false };
    }

    this.router = new Router({
      prefix: config.prefix,
    });
  }

  public fetch(method: string, url: string): IHttpHandler | IHandler | undefined {
    return this.router.fetch(method, url);
  }

  // node http 的基础实现，我没法测
  /* istanbul ignore next */
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
          runHandler(context, handler).then((v: any) => {
            const response = {
              code: 0,
              data: v,
              message: 'ok',
            }
            res.end(resStringify(response));
            if (this.config.verbose) {
              logger.info(`[${green('200')}] ${rightpad(inc.method, PAD)} ${context.path}`);
            }
          }).catch(e => {
            res.statusCode = this.getStatus(e);
            res.end(resStringify(unifiedError(e)));
            if (this.config.verbose) {
              logger.info(`[${yellow(`${res.statusCode}`)}] ${rightpad(inc.method, PAD)} ${context.path}`);
            }
          });

        } catch (e) {
          res.statusCode = this.getStatus(e);
          res.end(resStringify(unifiedError(e)));
          if (this.config.verbose) {
            logger.info(`[${yellow(`${res.statusCode}`)}] ${rightpad(inc.method, PAD)} ${inc.url}`);
          }
        }
      });
    });
    this.server.listen(port, host);
    logger.info(`Listen on ${host}:${port}`);
  }

  mount(handler: IHttpHandler): void {
    handler.app = this;
    const path: string = handler.path();
    this.router.register(handler.method(), path, handler);
    const prefix = this.config.prefix;
    console.log(`${rightpad(colorfy(HTTP_METHODS[handler.method()]), 16)}${rightpad(`${prefix ? `/${prefix}` : ''}${handler.path()}`, 32)}${grey(handler.name())}`);
  }

  /**
   * 这个要看具体项目内运行，测试条件困难，暂时没法测
   */
  /* istanbul ignore next */
  async scanHandler() {
    const handlers = scanHandler(this.basePath);
    handlers.forEach((handler: IHttpHandler) => {
      this.mount(handler);
    });
  }

  /**
   * 因为boot部分，涉及到运行时监听端口，打印console之类，不太好测试，也没必要测试。
   */
  /* istanbul ignore next */
  async boot() {
    // mount global route
    this.mount(Health);
    this.mount(Swagger);
    this.mount(Metrics);

    // mount customer handler
    await this.scanHandler();

    this.listen();
    if (process.env.NODE_ENV !== 'production') {
      const { host, port } = this.config;
      logger.info(`See: ${blue(`http://${host}:${port}/_swagger`)}`);
    }
  }

  public getStatus(e: { status?: HTTP_STATUS }): HTTP_STATUS {
    if (this.config.strictHttpStatus === false) {
      return HTTP_STATUS.OK;
    }
    return e.status || HTTP_STATUS.InternalServerError;
  }
}