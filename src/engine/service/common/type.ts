import BaseApplication from '../http/abstractApplication';

export type Excutable = () => Promise<any>;

export interface IExtendsGlobal extends NodeJS.Global {
  app: BaseApplication;
}