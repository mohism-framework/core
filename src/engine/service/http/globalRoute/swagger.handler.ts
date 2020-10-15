import { IHttpHandler } from '../httpHandler';
import { IMiddleware } from '../../common/IHandler';
import { Dict } from '@mohism/utils';
import { IDefinition } from '../../common/param-definition/IDefinition';
import { HTTP_METHODS } from '../constant';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import MohismError from '../../../../utils/mohism-error';


class SwaggerHandler implements IHttpHandler {
  middlewares(): Array<IMiddleware> {
    return [];
  }

  params(): Dict<IDefinition> {
    return {};
  }

  method(): HTTP_METHODS {
    return HTTP_METHODS.GET;
  }

  name(): string {
    return 'swagger api';
  }

  path(): string {
    return '/_swagger';
  }

  async run(): Promise<any> {
    const filePath: string = resolve(`${process.cwd()}/swagger.json`);
    let swagger: string = '';
    if (existsSync(filePath)) {
      swagger = readFileSync(filePath).toString();
    }
    if (swagger === '') {
      throw new MohismError('swagger.json not found.').setStatus(404);
    }
    return swagger;
  }
}

export default new SwaggerHandler();