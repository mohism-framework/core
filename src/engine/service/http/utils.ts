import { UnifiedResponse } from '@core/utils/global-type';
/**
 * TODO 有人能找到更好的序列化方式吗？
 * @param res {UnifiedResponse}
 */
export const resStringify = (res: UnifiedResponse): string => {
  // return JSON.stringify(res);
  return `{"code":${res.code},"message":"${res.message}"${res.data !== undefined ? `,"data":${JSON.stringify(res.data)}` : ''}}`;
};