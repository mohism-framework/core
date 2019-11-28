import { Dict } from "@mohism/utils";
import { IncomingHttpHeaders } from "http";

export interface IContext {
  path: string;
  query: Dict<any>;
  body: Dict<any>;
  headers: Dict<any>;
  cookie: Dict<any>;
  param: Dict<any>;
}

export interface IIncoming {
  url: string;
  body: string;
  headers: IncomingHttpHeaders;
  method: string,
}

