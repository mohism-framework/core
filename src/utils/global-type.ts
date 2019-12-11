
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

