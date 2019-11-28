import { Dict } from '@mohism/utils';

import { EL_TYPE } from '../common/constant';
import { IDefinition } from '../common/param-definition/IDefinition';
import { IContext } from '../http/paramParser/IContext';
import { HTTP_PARAM_LOCATION } from './constant';
import MohismError from '../../../utils/mohism-error';

export const validate = (ctx: IContext, rules: Dict<IDefinition>): Dict<any> => {
  const sources: Dict<any> = {};
  sources[HTTP_PARAM_LOCATION.BODY] = ctx.body;
  sources[HTTP_PARAM_LOCATION.HEADERS] = ctx.headers;
  sources[HTTP_PARAM_LOCATION.QUERY] = ctx.query;
  sources[HTTP_PARAM_LOCATION.PARAM] = ctx.param;

  const result: Dict<any> = {};
  Object.keys(rules).forEach((key: string): void => {
    const { data } = rules[key];

    if (data.required && (!data.optional) && (undefined === sources[data.in][data.name])) {
      throw new MohismError(`Required ${HTTP_PARAM_LOCATION[data.in].toLowerCase()}.${data.name}`).statusCode(400);
    }
    let value = toType(sources[data.in][data.name], data.type);
    const defaultValue = toType(data.default, data.type);

    if (value instanceof Error) {
      throw new MohismError(`${HTTP_PARAM_LOCATION[data.in].toLowerCase()}.${data.name} must be ${EL_TYPE[data.type]}`).statusCode(400);
    }

    if (value === undefined) {
      value = defaultValue;
    }

    // validation 
    // length   
    if (data.length !== undefined) {
      if (!(value.length >= data.length[0] && value.length <= data.length[1])) {
        throw new MohismError(`Validation Error: ${data.name} length must in ${JSON.stringify(data.length)}`).statusCode(400);
      }
    }
    // range
    if (data.range !== undefined) {
      if (data.range.min) {
        if (data.range.min.e) {
          if (!(value >= data.range.min.n)) {
            throw new MohismError(`Validation Error: ${data.name} must gte ${data.range.min.n}`).statusCode(400);
          }
        } else {
          if (!(value > data.range.min.n)) {
            throw new MohismError(`Validation Error: ${data.name} must gt ${data.range.min.n}`).statusCode(400);
          }
        }
      }
      if (data.range.max) {
        if (data.range.max.e) {
          if (!(value <= data.range.max.n)) {
            throw new MohismError(`Validation Error: ${data.name} must lte ${data.range.max.n}`).statusCode(400);
          }
        } else {
          if (!(value < data.range.max.n)) {
            throw new MohismError(`Validation Error: ${data.name} must lt ${data.range.max.n}`).statusCode(400);
          }
        }
      }
    }
    // choices
    if (data.choices !== undefined) {
      if (!data.choices.includes(value)) {
        throw new MohismError(`Validation Error: ${data.name} must be one of ${JSON.stringify(data.choices)}`).statusCode(400);
      }
    }
    // excludes
    if (data.excludes !== undefined) {
      if (data.excludes.includes(value)) {
        throw new MohismError(`Validation Error: ${data.name} should NOT be one of ${JSON.stringify(data.excludes)}`).statusCode(400);
      }
    }

    if (data.contains !== undefined) {
      if (!(value as string).includes(data.contains)) {
        throw new MohismError(`Validation Error: ${data.name} must contains "${data.contains}"`).statusCode(400);
      }
    }
    result[key] = value === undefined ? defaultValue : value;
  });

  return result;
};

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
};