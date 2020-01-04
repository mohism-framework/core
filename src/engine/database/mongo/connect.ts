import { get, has } from 'config';
import mongoose, { ConnectionOptions, Mongoose } from 'mongoose';
import { Logger } from '@mohism/utils';
import { cpus } from 'os';

mongoose.Promise = global.Promise;
mongoose.pluralize(undefined);

const defaultOptions: ConnectionOptions = {
  useNewUrlParser: true,
  poolSize: cpus().length || 10,
  useUnifiedTopology: true,
  family: 4,
};

let connection: Promise<Mongoose>;

const connect = async (): Promise<Mongoose> => {
  if (connection) {
    return connection;
  }
  const {
    username = '',
    password = '',
    host = '127.0.0.1',
    port = 27017,
    slave = [],
    replicaSet = '',
    dbname = 'test',
    options = {},
  } = has('mongo') ? get('mongo') : {};
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
  connection = mongoose.connect(dsn, {
    ...defaultOptions,
    ...options,
  });
  return connection;
}

export default connect;
