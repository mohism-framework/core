import { get, has } from 'config';
import mongoose, { ConnectionOptions, Mongoose } from 'mongoose';
import { Logger, Dict, rightpad } from '@mohism/utils';
import { cpus } from 'os';

mongoose.Promise = global.Promise;
mongoose.pluralize(undefined);

const defaultOptions: ConnectionOptions = {
  useNewUrlParser: true,
  poolSize: cpus().length || 10,
  useUnifiedTopology: true,
  family: 4,
};
export const Pool: Dict<Mongoose> = {};

const connect = async (name: string = 'default'): Promise<Mongoose> => {
  const {
    username = '',
    password = '',
    host = '127.0.0.1',
    port = 27017,
    slave = [],
    replicaSet = '',
    dbname = 'test',
    options = {},
  } = has(`mongo.${name}`) ? get(`mongo.${name}`) : {};
  let dsn: string;
  // dsn
  if (slave.length) {
    // cluster mode
    dsn = `mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}`;
    slave.forEach((s: { host: string, port: string | number }) => {
      dsn += `,${s.host}:${s.port}`;
    });
    dsn += `/${dbname}?replicaSet=${replicaSet}`;
  } else {
    // single
    dsn = `mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}/${dbname}`;
  }
  Logger.info(`New Connection: ${dsn}`);
  const connection = await mongoose.connect(dsn, {
    ...defaultOptions,
    ...options,
  });
  return connection;
}

export const init = async () => {
  const mongoConf: object = has('mongo') ? get('mongo') : {};
  const connectionNames = Object.keys(mongoConf);
  for (let i = 0; i < connectionNames.length; i++) {
    const name = connectionNames[i];
    const conn = await connect(name);
    Pool[name] = conn;
    Logger.info(`Mongo ${rightpad(name, 16)} [${'ok'.green}]`);
  }
}

export default async (name: string = 'default'): Promise<Mongoose> => {
  if (!Pool[name]) {
    Pool[name] = await connect(name);
  }
  return Pool[name];
}