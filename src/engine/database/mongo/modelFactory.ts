import { Schema, Mongoose, Document, Model as MongooseModel } from 'mongoose';
import { Dict } from '@mohism/utils';

import connect from './connect';

const Model = async (name: string, obj: Dict<any>): Promise<MongooseModel<Document>> => {
  const schema: Schema = new Schema(obj);
  const conn: Mongoose = await connect();
  return conn.model(name, schema);
}

export default Model;