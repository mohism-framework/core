import { Dict } from '@mohism/utils';

import MohismError from '../../../utils/mohism-error';
import { EL_TYPE } from '../common/constant';
import { IDefinition } from '../common/param-definition/IDefinition';
import { IContext } from '../http/paramParser/IContext';
import { HTTP_PARAM_LOCATION } from './constant';
import { HTTP_STATUS } from './statusCode';

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
      throw new MohismError(`Required ${HTTP_PARAM_LOCATION[data.in].toLowerCase()}.${data.name}`).setStatus(HTTP_STATUS.OK);
    }
    let value = toType(sources[data.in][data.name], data.type);
    const defaultValue = toType(data.default, data.type);

    if (value instanceof Error) {
      throw new MohismError(`${HTTP_PARAM_LOCATION[data.in].toLowerCase()}.${data.name} must be ${EL_TYPE[data.type]}`).setStatus(HTTP_STATUS.OK);
    }

    if (value === undefined) {
      value = defaultValue;
    }

    // validation 
    // length   
    if (data.length !== undefined && !(value.length >= data.length[0] && value.length <= data.length[1])) {
      throw new MohismError(`Validation Error: ${data.name} length must in ${JSON.stringify(data.length)}`).setStatus(HTTP_STATUS.OK);
    }
    // range
    if (data.range !== undefined) {
      if (data.range.min) {
        if (data.range.min.e && value < data.range.min.n) {
          throw new MohismError(`Validation Error: ${data.name} must gte ${data.range.min.n}`).setStatus(HTTP_STATUS.OK);
        } else if (!(value > data.range.min.n)) {
          throw new MohismError(`Validation Error: ${data.name} must gt ${data.range.min.n}`).setStatus(HTTP_STATUS.OK);
        }
      }
      if (data.range.max) {
        if (data.range.max.e && !(value <= data.range.max.n)) {
          throw new MohismError(`Validation Error: ${data.name} must lte ${data.range.max.n}`).setStatus(HTTP_STATUS.OK);
        } else if (!(value < data.range.max.n)) {
          throw new MohismError(`Validation Error: ${data.name} must lt ${data.range.max.n}`).setStatus(HTTP_STATUS.OK);
        }
      }
    }
    // choices
    if (data.choices !== undefined && !data.choices.includes(value)) {
      throw new MohismError(`Validation Error: ${data.name} must be one of ${JSON.stringify(data.choices)}`).setStatus(HTTP_STATUS.OK);
    }
    // excludes
    if (data.excludes !== undefined && data.excludes.includes(value)) {
      throw new MohismError(`Validation Error: ${data.name} should NOT be one of ${JSON.stringify(data.excludes)}`).setStatus(HTTP_STATUS.OK);
    }

    if (data.contains !== undefined && !(`${value}` as string).includes(data.contains)) {
      throw new MohismError(`Validation Error: ${data.name} must contains '${data.contains}'`).setStatus(HTTP_STATUS.OK);
    }
    result[key] = value;
  });

  return result;
};

export const toType = (raw: any, type: EL_TYPE): any => {
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
    return (raw === 'true' || raw === true) ? true : false;
  }
};