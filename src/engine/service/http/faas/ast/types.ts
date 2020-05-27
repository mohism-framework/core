import { Dict } from "@mohism/utils";

export type SimpleKey =
  | 'TSUnknownKeyword'
  | 'TSAnyKeyword'
  | 'TSBooleanKeyword'
  | 'TSNumberKeyword'
  | 'TSStringKeyword'
  | 'TSObjectKeyword';

export interface IParamDef {
  name: string;
  typeName: string;
  defaultValue?: any;
  comment?: string;
}

export interface IComment {
  start: number;
  end: number;
  comment: string;
  params?: Dict<string>;
}