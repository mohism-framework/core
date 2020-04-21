import { Document, Model, Mongoose } from 'mongoose';

import BaseApplication from '../http/abstractApplication';

let application: BaseApplication | null = null;



export const bindHooks = async (app: BaseApplication) => {
  application = app;
}

export const useModel = (name: string): Model<Document> => {
  return application?.models?.get(name) as Model<Document>;
}

export const useDB = (name: string): Mongoose => {
  return application?.db?.get(name) as Mongoose;
}