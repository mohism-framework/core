
export type MohismConf = {
  appId?: number | undefined;
  name?: string;
  type?: string;
  children: Array<{
    appId: number,
    name: string
  }>;
}

export type UnifiedResponse = {
  code: number,
  message: string,
  data?: any | undefined,
  extra?: any,
}

