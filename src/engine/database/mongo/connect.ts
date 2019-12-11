import { get, has } from 'config';
import mongoose, { ConnectionOptions, Mongoose } from 'mongoose';
import { Logger } from '@mohism/utils';

mongoose.Promise = global.Promise;
mongoose.pluralize(undefined);

const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
  connection = mongoose.connect(dsn, options);
  return connection;
}

export default connect;
