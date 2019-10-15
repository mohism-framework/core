/**
 * 一个接口，是有实现 IHandler 接口的类表现的
 * IHandler 会定义http中的各种信息，并自动注册到应用路由
 * 在处理参数阶段，会抹平http细节，以便测试时不需要完整mock请求
 */
import { HTTP_METHODS } from './constant/index';
import { Dict } from '../utils/globalType';
import { IDefinition } from './definitions/iDefinition';
import Router from 'koa-router';
import { Context } from 'vm';

const validate = (ctx: Context, rules: Dict<IDefinition>): Dict<any> => {
  // todo
  console.log(rules);
  return {};
}

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

export const magicMount = (router: Router, handler: IHandler): void => {
  const path = handler.group() ? `/${handler.group()}/${handler.path}` : `/${handler.path}`;
  const method = handler.method();
  switch (method) {
    case HTTP_METHODS.GET:
      router.get(path, async ctx => {
        const params = validate(ctx, handler.params());
        const rs = await handler.run(params);
        ctx.success(rs);
      });
      break;
    case HTTP_METHODS.POST:
      router.post(path, async ctx => {
        const params = validate(ctx, handler.params());
        const rs = await handler.run(params);
        ctx.success(rs);
      });
      break;
    case HTTP_METHODS.PUT:
      router.put(path, async ctx => {
        const params = validate(ctx, handler.params());
        const rs = await handler.run(params);
        ctx.success(rs);
      });
      break;
    case HTTP_METHODS.DELETE:
      router.delete(path, async ctx => {
        const params = validate(ctx, handler.params());
        const rs = await handler.run(params);
        ctx.success(rs);
      });
      break;
    default:
      break;
  }
}