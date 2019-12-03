import { Logger, rightpad } from '@mohism/utils';
import { green, grey, yellow } from 'colors';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { EOL } from 'os';

import { UnifiedResponse } from '../../../utils/global-type';
import MohismError from '../../../utils/mohism-error';
import { IApplication } from '../common/IAppliaction';
import { HTTP_METHODS, HttpConf } from './constant';
import { IHttpHandler } from './IHttpHandler';
import { Parser } from './paramParser';
import { IContext, IIncoming } from './paramParser/IContext';
import { colorfy, Router } from './router';
import { validate } from './validate';
import { IHandler } from '../common/IHandler';

export class HttpApplication implements IApplication {
  private server: Server | null;
  private config: HttpConf;
  private router: Router;

  constructor(config?: HttpConf) {
    this.config = config || {};
    if (process.env.NODE_ENV === 'production') {
      // force 'verbose' to false, for perfermence reason
      this.config = { ...this.config, verbose: false };
    }

    this.server = null;
    this.router = new Router();
    if (this.config.verbose) {
      console.log(`${EOL}Route Tables ============${EOL}`);
    }
  }

  mount(handler: IHttpHandler): void {
    const path: string = handler.path();
    this.router.register(handler.method(), path, handler);
    if (this.config.verbose) {
      console.log(`${rightpad(colorfy(HTTP_METHODS[handler.method()]), 16)}${rightpad(handler.path(), 32)}${grey(handler.name())}`);
    }
  }

  fetch(method: string, url: string): IHttpHandler | IHandler | undefined {
    return this.router.fetch(method, url);
  }

  listen(): void {
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
        res.setHeader('content-type', 'text/json');
        const inc: IIncoming = {
          url: req.url as string,
          body: rawbody.join(''),
          headers: req.headers,
          method: req.method as string,
        };

        try {
          const context: IContext = Parser(inc);
          const handler: IHttpHandler = this.fetch(inc.method, context.path) as IHttpHandler;
          const params = validate(context, handler.params());
          handler.run(params).then((v: any) => {
            const response: UnifiedResponse = {
              code: 0,
              data: v,
              message: 'ok',
            }
            res.end(JSON.stringify(response));
            if (this.config.verbose) {
              Logger.info(`[${green('200')}] ${rightpad(inc.method, 8)} ${context.path}`);
            }
          }).catch(e => {
            if (e instanceof MohismError) {
              res.statusCode = e.status;
              res.end(JSON.stringify(e.output()));
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({
                code: 500,
                message: e.message,
              }))
            }
            if (this.config.verbose) {
              Logger.info(`[${yellow(`${res.statusCode}`)}] ${rightpad(colorfy(inc.method), 16)} ${context.path}`);
            }
          });

        } catch (e) {
          if (e instanceof MohismError) {
            res.statusCode = e.status;
            res.end(JSON.stringify(e.output()));
          } else {
            res.statusCode = 500;
            res.end(JSON.stringify({
              code: 500,
              message: e.message,
            }))
          }
          if (this.config.verbose) {
            Logger.info(`[${yellow(`${res.statusCode}`)}] ${rightpad(colorfy(inc.method), 16)} ${inc.url}`);
          }
        }
      });
    });
    this.server.listen(port, host);
    Logger.info(`${host}:${port}`);
  }
}