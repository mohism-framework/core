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
}