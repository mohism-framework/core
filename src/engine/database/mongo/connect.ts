import { get } from '@mohism/config';
import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import { Logger, Dict, rightpad, Getter } from '@mohism/utils';
import { cpus } from 'os';
const logger = Logger();

mongoose.Promise = global.Promise;
mongoose.pluralize(undefined);

const defaultOptions = {
  useNewUrlParser: true,
  poolSize: cpus().length || 10,
  useUnifiedTopology: true,
  family: 4,
};
const Pool: Dict<Mongoose> = {};

const connect = async (name: string = 'default'): Promise<Mongoose> => {
  const {
    username = '',
    password = '',
    host = '127.0.0.1',
    authSource = 'admin',
    port = 27017,
    slave = [],
    replicaSet = '',
    dbname = 'test',
    options = {},
  } = get(`mongo.${name}`, {});
  let dsn: string;
  // dsn
  if (slave.length) {
    // cluster mode
    dsn = `mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}`;
    slave.forEach((s: { host: string, port: string | number }) => {
      dsn += `,${s.host}:${s.port}`;
    });
    dsn += `/${dbname}?replicaSet=${replicaSet}&authSource=${authSource}`;
  } else {
    // single
    dsn = `mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}/${dbname}?authSource=${authSource}`;
  }
  logger.info(`New Connection: ${dsn}`);
  return await mongoose.connect(dsn, {
    ...defaultOptions,
    ...options,
  } as ConnectOptions);
};

export const initMongo = async () => {
  const mongoConf: object = get('mongo', {});
  const connectionNames = Object.keys(mongoConf);
  for (let i = 0; i < connectionNames.length; i++) {
    const name = connectionNames[i];
    const conn = await connect(name);
    Pool[name] = conn;
    logger.info(`Mongo ${rightpad(name, 16)} [${'ok'.green}]`);
  }
  return new Getter<Mongoose>(Pool);
};

export default async (name: string = 'default'): Promise<Mongoose> => {
  if (!Pool[name]) {
    Pool[name] = await connect(name);
  }
  return Pool[name];
};