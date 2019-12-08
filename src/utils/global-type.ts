
export type AppMeta = {
  appId: number,
  name: string
};

export type MohismConf = {
  appId?: number | undefined;
  name?: string;
  type?: string;
  children?: Array<AppMeta>;
}

export type UnifiedResponse = {
  code: number,
  message: string,
  data?: any | undefined,
}

/**
 * 在没有data的场合(错误之类), 或者不需要返回data的场合，优化编码速度
 * @param res {UnifiedResponse}
 */
export const resStringify = (res: UnifiedResponse): string => {
  if(!res.data){
    return `{"code":${res.code},"message":"${res.message}","data":{}}`;
  }
  return JSON.stringify(res);
};

