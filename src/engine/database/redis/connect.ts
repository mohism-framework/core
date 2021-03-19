import { get } from '@mohism/config';
import { Dict, Getter, Logger, rightpad } from '@mohism/utils';
import IORedis, { Redis, RedisOptions } from 'ioredis';

const logger = Logger();

export const Pool: Dict<Redis> = {};

export const initRedis = async () => {
  const redisConf: RedisOptions = get('redis', {});
  const connectionNames = Object.keys(redisConf);
  for (let i = 0; i < connectionNames.length; i++) {
    const name = connectionNames[i];
    const conf = get(`redis.${name}`, null);
    if (conf) {
      const conn = new IORedis(conf);
      Pool[name] = conn;
      logger.info(`Redis ${rightpad(name, 16)} [${'ok'.green}]`);
    }
  }
  return new Getter<Redis>(Pool)
};

export default async (name: string = 'default'): Promise<Redis> => {
  if (!Pool[name]) {
    const {
      host = 'localhost',
      port = 6379,
      password = '',
      db = 0,
      family = 4,
    } = get(`redis.${name}`, {});
    Pool[name] = new IORedis({
      host,
      port,
      password,
      db,
      family,
    });
  }
  return Pool[name];
};