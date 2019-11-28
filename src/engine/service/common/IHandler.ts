import { Dict } from '@mohism/utils';
import { IDefinition } from './param-definition/IDefinition';



export interface IMiddleware {
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