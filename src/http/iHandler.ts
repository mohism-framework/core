/**
 * 一个接口，是有实现 IHandler 接口的类表现的
 * IHandler 会定义http中的各种信息，并自动注册到应用路由
 * 在处理参数阶段，会抹平http细节，以便测试时不需要完整mock请求
 */
import { HTTP_METHODS, HTTP_PARAM_LOCATION, EL_TYPE } from './constant/index';
import { Dict } from '../utils/globalType';
import { IDefinition } from './definitions/iDefinition';
import Router from 'koa-router';
import { Context } from 'koa';
import MohismErr from '../utils/mohismError';

const validate = (ctx: Context | any, rules: Dict<IDefinition>): Dict<any> => {
  const sources: Dict<any> = {};
  sources[HTTP_PARAM_LOCATION.BODY] = ctx.request.body;
  sources[HTTP_PARAM_LOCATION.HEADERS] = ctx.request.header;
  sources[HTTP_PARAM_LOCATION.QUERY] = ctx.request.query as Dict<any>;

  const path: string = ctx.request.path;

  const result: Dict<any> = {};
  Object.keys(rules).forEach((key: string): void => {
    const { data } = rules[key];
    console.log(data);
    if (data.required && (!data.optional) && (undefined === sources[data.in][data.name])) {
      throw new MohismErr(`Required ${HTTP_PARAM_LOCATION[data.in].toLowerCase()}.${data.name}`).statusCode(400);
    }
    const value = toType(sources[data.in][data.name], data.type);
    const defaultValue = toType(data.default, data.type);

    if (value instanceof Error) {
      throw new MohismErr(`${HTTP_PARAM_LOCATION[data.in].toLowerCase()}.${data.name} must be ${EL_TYPE[data.type]}`).statusCode(400);
    }

    // validation 
    // length   
    if (data.length !== undefined) {
      if (!(value.length >= data.length[0] && value.length <= data.length[1])) {
        throw new MohismErr(`Validation Error: ${data.name} length must in ${JSON.stringify(data.length)}`).statusCode(400);
      }
    }
    // range
    if (data.range !== undefined) {
      if (data.range.min) {
        if (data.range.min.e) {
          if (!(value >= data.range.min.n)) {
            throw new MohismErr(`Validation Error: ${data.name} must gte ${data.range.min.n}`).statusCode(400);
          }
        } else {
          if (!(value > data.range.min.n)) {
            throw new MohismErr(`Validation Error: ${data.name} must gt ${data.range.min.n}`).statusCode(400);
          }
        }
      }
      if (data.range.max) {
        if (data.range.max.e) {
          if (!(value <= data.range.max.n)) {
            throw new MohismErr(`Validation Error: ${data.name} must lte ${data.range.max.n}`).statusCode(400);
          }
        } else {
          if (!(value < data.range.max.n)) {
            throw new MohismErr(`Validation Error: ${data.name} must lt ${data.range.max.n}`).statusCode(400);
          }
        }
      }
    }
    // choices
    if (data.choices !== undefined) {
      if (!data.choices.includes(value)) {
        throw new MohismErr(`Validation Error: ${data.name} must be one of ${JSON.stringify(data.choices)}`).statusCode(400);
      }
    }
    // excludes
    if (data.excludes !== undefined) {
      if (data.excludes.includes(value)) {
        throw new MohismErr(`Validation Error: ${data.name} should NOT be one of ${JSON.stringify(data.excludes)}`).statusCode(400);
      }
    }

    // contains
    if (data.contains !== undefined) {
      if (!(value as string).includes(data.contains)) {
        throw new MohismErr(`Validation Error: ${data.name} must contains "${data.contains}"`).statusCode(400);
      }
    }
    result[data.name] = value || defaultValue;
  });

  return result;
}

const toType = (raw: any, type: EL_TYPE): any => {
  if (!raw) {
    return raw;
  }
  switch (type) {
    case EL_TYPE.NUMBER:
      if (Number.isNaN(+raw)) {
        return new Error();
      }
      return +raw;
    case EL_TYPE.STRING:
      return `${raw}`;
    case EL_TYPE.BOOLEAN:
      if (!['true', 'false', true, false].includes(raw)) {
        return new Error();
      }
      return raw === 'true' ? true : false;
    default:
      return raw;
  }
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
  const path = (handler.group() ? `/${handler.group()}/${handler.path()}` : `/${handler.path()}`).replace(/\/\//g, '/');
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