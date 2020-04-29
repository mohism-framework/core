import { Dict, Getter, Logger } from '@mohism/utils';
import { existsSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { Server } from 'http';
import { Document, Model, Mongoose } from 'mongoose';
import { extname, resolve } from 'path';

import { init, Pool } from '../../database/mongo/connect';
import { IApplication } from '../common/IAppliaction';
import { bindHooks } from '../hooks';
import { HttpConf } from './constant';

const logger = Logger();

export type THooks = 'onReady' | 'onError';

export default abstract class BaseApplication implements IApplication {
  protected server: Server | null;
  protected config: HttpConf;
  protected basePath: string;
  protected _db: Getter<Mongoose> | null;
  protected _models: Getter<Model<Document>> | null;

  constructor(config: HttpConf, basePath: string) {
    this.basePath = basePath;
    this.config = config || {};
    this.server = null;
    this._db = null;
    this._models = null;
    // this is important!
    bindHooks(this);
  }

  get db() {
    return this._db;
  }

  get models() {
    return this._models;
  }

  /**
   * 实现这个方法
   */
  async abstract boot(): Promise<void>;

  /* istanbul ignore next */
  private async scanModel() {
    this._db = new Getter<Mongoose>(Pool);
    const modelPath = resolve(this.basePath, 'models');
    if (existsSync(modelPath) && statSync(modelPath).isDirectory()) {
      const allModels: Dict<Model<Document>> = {};
      const files = readdirSync(modelPath);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const id: string = file.split('.')[0];
        if (!['.js', 'ts'].includes(extname(file))) {
          continue;
        }
        const mod = require(`${modelPath}/${file}`.replace(extname(file), '')).default;
        allModels[id] = await mod();
      }
      this._models = new Getter(allModels);
    }
  }

  /* istanbul ignore next */
  public async bootstrap() {
    try {
      // init db
      await init();
      await this.scanModel();
      await this.boot();
    } catch (e) {
      logger.err(e.message);
    }
  }
} 