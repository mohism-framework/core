import { IHandler } from '../common/IHandler';
import { HTTP_METHODS } from './constant';

export interface IHttpHandler extends IHandler {
  method(): HTTP_METHODS;
}