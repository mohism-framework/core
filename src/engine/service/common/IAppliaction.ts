import { Dict } from "@mohism/utils";
import { IHandler } from "./IHandler";

export interface IApplication {
  
  // mount handler
  mount(handler: IHandler):void;

  // server listen
  listen(): void;
}