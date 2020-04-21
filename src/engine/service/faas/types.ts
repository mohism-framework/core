import { HTTP_METHODS } from '../http/constant';
import { IMiddleware } from '../common/IHandler';
import { IDefinition } from '../common/param-definition/IDefinition';
import { Dict } from '@mohism/utils/dist/libs/type';

export interface IFaasModule {
  default: Function;
  name: string;
  path: string;
  method: HTTP_METHODS;
  middlewares: IMiddleware[];
  params: Dict<IDefinition>;
}
