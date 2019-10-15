export enum HTTP_METHODS {
  GET = 1,
  POST,
  PUT,
  DELETE,
  HEAD,
  OPTION,
};

export enum HTTP_PARAM_LOCATION {
  BODY = 1,
  QUERY,
  HEADERS,
  PATH,
}

// 参数字段类型
export enum EL_TYPE {
  NUMBER = 1,
  STRING,
  BOOLEAN,
}