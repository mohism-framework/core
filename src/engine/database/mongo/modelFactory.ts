import { Schema, Mongoose, Document, Model as MongooseModel } from 'mongoose';
import { Dict } from '@mohism/utils';

import connect from './connect';

const Model = async (name: string, i: Dict<any>): Promise<MongooseModel<Document>> => {
  const schema: Schema = new Schema(i);
  const conn: Mongoose = await connect();
  return conn.model(name, schema);
}

export default Model;