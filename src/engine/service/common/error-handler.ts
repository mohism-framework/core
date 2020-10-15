import { existsSync, readFileSync } from 'fs';

import { MohismConf, UnifiedResponse } from '../../../utils/global-type';
import MohismError from '../../../utils/mohism-error';

let mohismConf: MohismConf = {};

if (existsSync(`${process.cwd()}/mohism.json`)) {
  mohismConf = JSON.parse(readFileSync(`${process.cwd()}/mohism.json`).toString());
}

export const unifiedError = (err: Error | MohismError): UnifiedResponse => {
  const { appId = 9999 } = mohismConf;
  if (err instanceof MohismError) {
    return {
      code: appId * 1e6 + err.status * 1e3 + err.seq,
      message: err.message,
    };
  }
  return {
    code: appId * 1e6 + 500000,
    message: `Internal Server Error: ${err.message}`,
  };
};