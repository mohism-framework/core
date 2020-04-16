import { Schema, Mongoose, Document, Model as MongooseModel } from 'mongoose';
import { Dict } from '@mohism/utils';

import get from './connect';

interface IModelOption {
  connection: string;
}

const Model = async (name: string, obj: Dict<any>, options: IModelOption = { connection: 'default' }): Promise<MongooseModel<Document>> => {
  const schema: Schema = new Schema(obj);
  const conn: Mongoose = await get(options.connection);
  return conn.model(name, schema);
}

export default Model;