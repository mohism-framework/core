import { Dict } from '@mohism/utils';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

import { IApplication } from '../common/IAppliaction';
import { IHandler } from '../common/IHandler';
import { HttpConf } from './constant';

export class HttpApplication implements IApplication {
  private server: Server | null;
  private config: HttpConf;
  constructor(config: HttpConf) {
    this.config = config;
    this.server = null;
  }

  mount(handler: IHandler): void {

  }

  pick(...args: any): Dict<any> {
    return {};
  }

  listen(): void {
    const { port, host } = this.config;
    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (this.config.cors) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
        res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS,HEAD');
      }
    });
    this.server.listen(port, host);
  }
}