import { Dict } from '@mohism/utils';

import { IContext, IIncoming } from './IContext';
import MohismError from '../../../../utils/mohism-error';
import { HTTP_STATUS } from '../statusCode';

const parseBody = (inc: IIncoming): Dict<any> => {
  if (!inc.body || inc.body.length === 0) {
    return {};
  }
  if ((inc.headers['content-type'] === undefined) || (inc.headers['content-type'] as string).includes('json')) {
    try {
      return JSON.parse(inc.body);
    } catch {
      throw new MohismError('bad request, invalid json').setStatus(HTTP_STATUS.UnprocessableEntity);
    }
  }
  throw new MohismError('bad request, only support application/json').setStatus(HTTP_STATUS.UnsupportedMediaType);
};

const parseQuery = (inc: IIncoming): Dict<any> => {
  const pieces = (inc.url.split('?')[1] || '').split('&');
  const query: Dict<any> = {};
  pieces.forEach((piece: string) => {
    const [k, v] = piece.split('=');
    v !== undefined && (query[k] = v);
  });
  return query;
};

const parseHeaders = (inc: IIncoming): Dict<any> => {
  return inc.headers;
};

const parseCookie = (inc: IIncoming): Dict<any> => {
  const pieces = (inc.headers.cookie || '').split(/;\s?/);
  const cookie: Dict<any> = {};
  pieces.forEach((piece: string) => {
    const [k, v] = piece.split('=');
    v !== undefined && (cookie[k] = v);
  });
  return cookie;
};

const parseParam = (): Dict<any> => {
  return {};
};

const parsePath = (inc: IIncoming): string => {
  return inc.url.split('?')[0];
};

export const Parser = (inc: IIncoming): IContext => {
  const result: IContext = {
    path: parsePath(inc),
    body: parseBody(inc),
    headers: parseHeaders(inc),
    query: parseQuery(inc),
    cookie: parseCookie(inc),
    param: parseParam(),
  };

  return result;
};