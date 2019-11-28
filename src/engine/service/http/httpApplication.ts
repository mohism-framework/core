import { Dict, Logger } from '@mohism/utils';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

import MohismError from '../../../utils/mohism-error';
import { IApplication } from '../common/IAppliaction';
import { HttpConf } from './constant';
import { IHttpHandler } from './IHttpHandler';
import { Parser } from './paramParser';
import { IIncoming, IContext } from './paramParser/IContext';
import { Router } from './router';
import { validate } from './validate';
import { UnifiedResponse } from '../../../utils/global-type';


export class HttpApplication implements IApplication {
  private server: Server | null;
  private config: HttpConf;
  private router: Router;
  constructor(config: HttpConf) {
    this.config = config;
    this.server = null;
    this.router = new Router();
  }

  mount(handler: IHttpHandler): void {
    const path: string = handler.path();
    this.router.register(handler.method(), path, handler);
  }

  listen(): void {
    const { port, host } = this.config;
    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (this.config.cors) {
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

          const handler: IHttpHandler = this.router.fetch(inc.method, context.path) as IHttpHandler;

          const params = validate(Parser(inc), handler.params());

          handler.run(params).then((v: any) => {
            const response: UnifiedResponse = {
              code: 0,
              data: v,
              message: 'ok',
            }
            res.end(JSON.stringify(response));
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
        }
      });
    });
    this.server.listen(port, host);
    Logger.info(`${host} : ${port}`)
  }
}