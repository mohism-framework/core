import { Dict } from '@mohism/utils';
import { assert } from 'chai';
import { describe, it } from 'mocha';

import { IDefinition } from '../src/engine/service/common/param-definition/IDefinition';
import { runHandler, AHttpHandler } from '../src/engine/service/http/httpHandler';
import { IContext } from '../src/engine/service/http/paramParser/IContext';
import { IMiddleware } from '../src/engine/service/common/IHandler';
import { HTTP_METHODS } from '../src/engine/service/http/constant';

const ctx: IContext = {
  path: '',
  query: {},
  body: {},
  headers: {},
  cookie: {},
  param: {},
};

const mw: IMiddleware = {
  name: () => '',
  params: () => { return {} as Dict<IDefinition> },
  run: async () => { },
}

class TestHandler extends AHttpHandler {
  async run() {
    return 'ok';
  }
}

const fn = new TestHandler();

class TestHandlerWithMW extends AHttpHandler {
  middlewares(): Array<IMiddleware> {
    return [mw];
  }
  async run() {
    return 'ok';
  }
}

const fn2 = new TestHandlerWithMW();

describe('http-handler', () => {
  it('aHttpHandler', () => {
    assert.equal(fn.name(), '');
    assert.equal(fn.path(), '/');
    assert.equal(fn.method(), HTTP_METHODS.GET);
  });
  it('run-handler', async () => {
    assert.equal(await runHandler(ctx, fn), 'ok');
    assert.equal(await runHandler(ctx, fn2), 'ok');
  });
});