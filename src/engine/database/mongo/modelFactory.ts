import { Dict, Maker } from '@mohism/utils';
import { IMaker } from '@mohism/utils/dist/libs/lazy';
import { Connection, Document, Model, Schema } from 'mongoose';

import get from './connect';

interface IModelOption {
  connection: string;
}

/**
 * 包装一个对象成为mongoose模型
 * 需要定义注册名字（useModel用），以及字段定义 {field:String|Number|Other}
 * @param name example: user
 * @param obj example: { name: String, age: Number }
 * @param options 
 * @example
import { Model } from "@mohism/core";

export default Model('app', {
  name: { type: String, required: true },
  url: { type: String, default: 'http://' },
  icon: { type: String, default: 'app' },
});
 */

export default (name: string, obj: Dict<any>, options: IModelOption = { connection: 'default' }): IMaker<Model<Document>> => {
  return Maker(async () => {
    const schema: Schema = new Schema(obj, {
      versionKey: false,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    });
    const conn: Connection = await get(options.connection);
    return conn.model(name, schema);
  });
};