import { Dict } from '@mohism/utils';
import BaseApplication from '../http/abstractApplication';
import { IContext } from '../http/paramParser/IContext';
import { IDefinition } from './param-definition/IDefinition';

/**
 * IMiddleware 类型
 * 一个基础的中间件类型，包含了名字，可选的描述信息，参数定义，执行逻辑
 * 这个可以被普通的中间件实现，也可以被接口handler实现，上面的基本要素还是要有
 */
export interface IMiddleware {
  app?: BaseApplication;
  ctx?: IContext | undefined;
  /**
   * 名字
   */
  name(): string;
  /**
   * 描述
   */
  description?: () => string;
  /**
   * 入参定义
   */
  params(): Dict<IDefinition>;
  /**
   * 执行的函数
   * @param params {Dict<any>}
   */
  run(params: Dict<any>): Promise<any>;
}

/**
 * 接口handler类型
 * 在中间件的基础上，增加了 path 信息，和 前置中间件信息
 * 这就描述了一个常见的 handler 类型的信息，
 * 将路由信息匹配到handler，并且执行一些前置中间件，比如鉴权
 */
export interface IHandler extends IMiddleware {
  /**
   * 路由信息
   */
  path(): string;

  /**
   * 中间件
   */
  middlewares(): Array<IMiddleware>;
}

export default IHandler;