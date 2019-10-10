/**
 * 一个接口，是有实现 IHandler 接口的类表现的
 * IHandler 会定义http中的各种信息，并自动注册到应用路由
 * 在处理参数阶段，会抹平http细节，以便测试时不需要完整mock请求
 */
import { HTTP_METHODS } from './constant/index';
import { Dict } from '../utils/globalType';
import { IDefinition } from './definitions/iDefinition';

export default interface IHandler {
  /**
   * 入参定义
   */ 
  params(): Dict<IDefinition>;
  /**
   * 请求方法
   */
  method(): HTTP_METHODS;
  /**
   * 接口分组，会在url前面加prefix
   */
  group(): string;
  /**
   * url
   */
  path(): string;
  /**
   * 接口逻辑，返回的结构会进一步包装给ctx
   */
  run(params: Dict<any>): Promise<any>;
}