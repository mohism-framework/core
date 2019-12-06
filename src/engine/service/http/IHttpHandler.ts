import { IHandler } from '../common/IHandler';
import { HTTP_METHODS } from './constant';
import { HttpApplication } from './httpApplication';

export interface IHttpHandler extends IHandler {
  app?: HttpApplication;
  method(): HTTP_METHODS;
}