import { Dict } from "@mohism/utils";
import { IHandler } from "./IHandler";

export interface IApplication {
  // conversion incoming params into dictionary
  // implements : koa2, express, and any other rpc
  pick(...args: any): Dict<any>;

  // mount handler
  mount(handler: IHandler):void;

  // server listen
  listen(): void;
}