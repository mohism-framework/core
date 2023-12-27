import { extname, join, resolve } from 'path';
import { parseExpression } from "cron-parser";
import BaseApplication from '../common/abstractApplication';
import { ICronexpr } from './type';
import { readdirSync } from 'fs';
import { Dict, Logger } from '@mohism/utils';
import { EOL } from 'os';

const logger = Logger();

export default class CronApplication extends BaseApplication {
  jobs: Dict<ICronexpr>;
  constructor(basePath: string) {
    super(basePath);
    this.jobs = {};
  }

  async scanJob() {
    const jobsPath = resolve(`${this.basePath}/jobs`);
    const result: Array<ICronexpr> = [];
    readdirSync(jobsPath).forEach(file => {
      if (file.endsWith('.d.ts')) return;
      const job: ICronexpr = require(join(jobsPath, file).replace(extname(file), '')).default;
      this.jobs[job.name] = job;
    })
  }

  exec() {
    Object.values(this.jobs).forEach(job => {
      this.run(job);
    });
  }

  private async run({ expr, func, name, immediate = false }: ICronexpr) {
    try {
      if (immediate) {
        await func();
      }
      const next = parseExpression(expr).next().getTime() - Date.now();
      setTimeout(async () => {
        logger.info(`Run [${name}] at ${new Date().toLocaleTimeString()}`);
        await func();
        logger.info(`Run [${name}] Done!${EOL}`);
        this.run({ expr, func, name });
      }, next);
    } catch (e: unknown) {
      logger.err(`[${name}] ${(e as Error).message}`);
    }
  }

  async boot(): Promise<void> {
    await this.scanJob();
    this.exec();
  }
}