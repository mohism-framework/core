import { init, Pool } from '../../database/mongo/connect';
import { Dict, Getter, Logger } from '@mohism/utils';
import { Server } from 'http';
import { Mongoose } from 'mongoose';

import { IApplication } from '../common/IAppliaction';
import { IExtendsGlobal } from '../common/type';
import { HttpConf } from './constant';

export type THooks = 'onReady' | 'onError';

export default abstract class BaseApplication implements IApplication {
  protected server: Server | null;
  protected config: HttpConf;
  protected basePath: string;
  protected _db: Getter<Dict<Mongoose>, Mongoose> | null;
  protected hooks: Record<THooks, Function[]>;

  constructor(config: HttpConf, basePath: string) {
    this.basePath = basePath;
    this.config = config || {};
    this.server = null;
    this._db = null;
    this.hooks = {
      onReady: [],
      onError: [],
    } as Record<THooks, Function[]>;

    (global as IExtendsGlobal).app = this;

  }

  public onReady(fn: Function) {
    this.hooks.onReady.push(fn);
  }

  get db() {
    return this._db;
  }

  /**
   * 实现这个方法
   */
  abstract boot(): void;

  public async bootstrap() {
    try {
      // init db
      await init();
      this._db = new Getter<Dict<Mongoose>, Mongoose>(Pool);
      await this.boot();
    } catch (e) {
      Logger.err(e.message);
    } finally {
      this.hooks.onReady.forEach((fn: Function) => {
        fn();
      });
    }
  }
} 