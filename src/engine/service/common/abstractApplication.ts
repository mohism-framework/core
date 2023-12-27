import { Dict, Getter, Logger } from '@mohism/utils';
import { existsSync, readdirSync, statSync } from 'fs';
import { Document, Model, Mongoose, Connection } from 'mongoose';
import { extname, resolve } from 'path';
import MohismError from '../../../utils/mohism-error';

import { initMongo } from '../../database/mongo/connect';
import { initRedis } from '../../database/redis/connect';
import { IApplication } from './IAppliaction';
import { bindHooks } from '../hooks';
import { Redis } from 'ioredis';


const logger = Logger();

export type THooks = 'onReady' | 'onError';

export default abstract class BaseApplication implements IApplication {
  protected basePath: string;
  protected _redis: Getter<Redis> | null;
  protected _db: Getter<Mongoose> | null;
  protected _models: Getter<Model<Document>> | null;

  constructor(basePath: string) {
    this.basePath = basePath;
    this._redis = null;
    this._db = null;
    this._models = null;
    // this is important!
    bindHooks(this);
  }

  /* istanbul ignore next */
  get redis() {
    return this._redis;
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
  abstract boot(): Promise<void>;

  /* istanbul ignore next */
  private async scanModel() {
    const modelPath = resolve(this.basePath, 'models');

    if (existsSync(modelPath) && statSync(modelPath).isDirectory()) {
      const allModels: Dict<Model<Document>> = {};
      const files = readdirSync(modelPath);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.endsWith('.d.ts')) {
          continue;
        }
        const id: string = file.split('.')[0];
        if (!['.js', '.ts'].includes(extname(file))) {
          continue;
        }
        const mod = require(`${modelPath}/${file}`.replace(extname(file), '')).default;
        allModels[id] = await mod();
      }
      this._models = new Getter<Model<Document>>(allModels);
      logger.info('Load Models [OK]');
    }
  }

  /* istanbul ignore next */
  private async scanError() {
    const errorPath = resolve(this.basePath, 'errors');
    if (existsSync(errorPath) && statSync(errorPath).isDirectory()) {
      const files = readdirSync(errorPath);
      const SEQ_POOL: Dict<number> = {};
      for (let i = 0; i < files.length; i++) {
        Object.values<MohismError | unknown>(require(`${errorPath}/${files[i]}`))
          .forEach(instance => {
            if (instance instanceof MohismError) {
              const status = instance.getStatus();
              SEQ_POOL[status] = SEQ_POOL[status] || 1;
              instance.setSeq(SEQ_POOL[status]);
              SEQ_POOL[status]++;
            }
          });
      }
      logger.info('Load Errors [OK]');
    }
  }

  /* istanbul ignore next */
  public async bootstrap() {
    try {
      // init db
      this._db = await initMongo();
      await this.scanModel();
      this._redis = await initRedis();
      await this.scanError();
      await this.boot();
    } catch (e) {
      logger.err((e as Error).message);
    }
  }
}