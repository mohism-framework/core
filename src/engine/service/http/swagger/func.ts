import { Dict } from '@mohism/utils';
import { existsSync } from 'fs';
import { join } from 'path';

import { MohismConf } from '../../../../utils/global-type';
import { EL_TYPE } from '../../common/constant';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_PARAM_LOCATION, HttpConf } from '../constant';
import { ISwaggerParamBase } from './type';

export function getConfig(basePath: string) {
  /* istanbul ignore next */
  if (!existsSync(join(basePath, 'mohism.json'))) {
    throw new Error(`不正确的执行路径: ${basePath}`);
  }
  const mohismConf: MohismConf = require(join(basePath, 'mohism.json'));
  /* istanbul ignore next */
  if (mohismConf.type !== 'api') {
    throw new Error(`类型 ${mohismConf.type || '?'} 不支持生成swagger`);
  }
  const { version, description } = require(join(basePath, 'package.json'));
  const httpConf: HttpConf = require(join(basePath, 'config', `${process.env.NODE_ENV || 'global'}.json`)).http;
  return {
    ...mohismConf,
    projectRoot: basePath,
    version,
    description,
    httpConf,
  };
}

export function def2params(defs: Dict<IDefinition>) {
  return Object.values(defs).map(({ data }) => ({
    in: HTTP_PARAM_LOCATION[data.in].toLowerCase(),
    name: data.name,
    description: data.comment,
    required: !data.optional,
    type: EL_TYPE[data.type].toLowerCase(),
    default: data.default,
  } as ISwaggerParamBase));
}