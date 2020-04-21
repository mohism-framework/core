import { Dict, Maker } from '@mohism/utils';
import { IMaker } from '@mohism/utils/dist/libs/lazy';
import { Document, Model as MongooseModel, Mongoose, Schema } from 'mongoose';

import get from './connect';

interface IModelOption {
  connection: string;
}

const Model = (name: string, obj: Dict<any>, options: IModelOption = { connection: 'default' }): IMaker<MongooseModel<Document>> => {
  return Maker(async () => {
    const schema: Schema = new Schema(obj, {
      versionKey: false,
    });
    const conn: Mongoose = await get(options.connection);
    return conn.model(name, schema);
  });
};

export default Model;