import { Document, Model, Mongoose } from 'mongoose';

import BaseApplication from '../common/abstractApplication';

let application: BaseApplication | null = null;

export const bindHooks = async (app: BaseApplication) => {
  application = app;
};

/**
 * 从 src/models 目录里自动扫描全部model并挂载到app里
 * 这个方法可以获取到一个模型实例 🤡
 * @param name 数据模型的名字
 */
export const useModel = <T extends Document>(name: string): Model<T> => {
  return application?.models?.get(name) as unknown as Model<T>;
};

/**
 * 对于一些特殊场景，可以通过这个方法得到一个DB实例
 * @param name 
 */
export const useDB = (name: string): Mongoose => {
  return application?.db?.get(name) as Mongoose;
};
