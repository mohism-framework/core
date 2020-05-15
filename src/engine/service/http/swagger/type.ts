import { Dict } from "@mohism/utils";

export interface IServiceInfo {
  description: string;
  version: string;
  title: string;
  [index: string]: any;
}

export interface ITag {
  name: string;
  description: string;
}

export interface ISwaggerDef { /** TODO */ }

type ContentType = 'multipart/form-data' | 'application/json';

export interface ISwaggerParamBase {
  in: 'path' | 'formData' | 'body' | 'query' | 'header';
  name: string;
  description: string;
  required?: boolean;
  schema?: {
    $ref: string;
  } | { type: 'array', items: { $ref: string } },
  type?: 'string' | 'integer' | 'array' | 'boolean';
  default?: any;
  [index: string]: any;
}
export interface ISwaggerArrayItemParam extends ISwaggerParamBase {
  enum: Array<any>;
}
export interface ISwaggerArrayParam extends ISwaggerParamBase {
  type: 'array',
  items: ISwaggerArrayItemParam;
}

export interface ISwaggerNumberParam extends ISwaggerParamBase {
  maximum: number;
  minimum: number;
}

export interface ISwaggerResponse {
  description: string;
  headers?: Dict<{
    type: 'string' | 'integer';
    description: string;
  }>;
  schema: {
    $ref: string;
  }
}

export interface ISwaggerRouter {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  consumes: ContentType[];
  prodcues: ContentType[];
  parameters: Array<ISwaggerArrayParam | ISwaggerNumberParam | ISwaggerParamBase>;
  responses: Dict<ISwaggerResponse>;
}

export interface ISwaggerPath extends Dict<ISwaggerRouter> { }

export interface ISwagger {
  swagger: '2.0' | '3.0';
  info: IServiceInfo;
  host: string;
  basePath: string;
  tags: Array<ITag>;
  schemes: Array<'http' | 'https'>;
  definitions: Dict<ISwaggerDef>;
  paths: Dict<ISwaggerPath>
}