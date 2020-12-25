import { Dict } from '@mohism/utils';
export enum HTTP_METHODS {
  GET = 1,
  POST,
  PUT,
  DELETE,
  HEAD,
  OPTION,
}

export enum HTTP_PARAM_LOCATION {
  BODY = 1,
  QUERY,
  HEADERS,
  PARAM,
}

export type NextFn = () => Promise<any>;

export type HttpConf = {
  host?: string;
  port?: number;
  cors?: boolean | Dict<string>;
  verbose?: boolean;
  prefix?: string;
  strictHttpStatus?: boolean;
}