import { Dict } from '@mohism/utils';
import { assert } from 'chai';
import { describe, it } from 'mocha';

import { IDefinition } from '../src/engine/service/common/param-definition/IDefinition';
import { HTTP_METHODS } from '../src/engine/service/http/constant';
import { HttpApplication, } from '../src/engine/service/http/httpApplication';
import HttpTestKit from '../src/engine/service/http/httpTestKit';

import { resStringify } from '../src/engine/service/http/utils';
import { IHttpHandler } from '../src/engine/service/http/httpHandler';

const fn: IHttpHandler = {
  method: () => HTTP_METHODS.GET,
  name: () => 'demo',
  path: () => '/ping',
  middlewares: () => [],
  params: () => { return {} as Dict<IDefinition> },
  run: async () => { return {} }
};

describe('httpApp', () => {
  it('testkit-get', () => {
    const t = new HttpTestKit();
    t.GET();
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '',
      headers: {},
      method: 'GET',
    });
  });

  it('testkit-post', () => {
    const t = new HttpTestKit();
    t.POST();
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '',
      headers: {},
      method: 'POST',
    });
  });

  it('testkit-put', () => {
    const t = new HttpTestKit();
    t.PUT();
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '',
      headers: {},
      method: 'PUT',
    });
  });

  it('testkit-delete', () => {
    const t = new HttpTestKit();
    t.DELETE();
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '',
      headers: {},
      method: 'DELETE',
    });
  });

  it('testkit-head', () => {
    const t = new HttpTestKit();
    t.HEAD();
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '',
      headers: {},
      method: 'HEAD',
    });
  });

  it('testkit-headers', () => {
    const t = new HttpTestKit();
    t.headers({ a: '123' });
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '',
      headers: { a: '123' },
      method: '',
    });
  });

  it('testkit-body', () => {
    const t = new HttpTestKit();
    t.body({ a: '123' });
    assert.deepEqual(t.toInc(), {
      url: '',
      body: '{"a":"123"}',
      headers: {},
      method: '',
    });
  });

  it('testkit-url', () => {
    const t = new HttpTestKit();
    t.url('/ping');
    assert.deepEqual(t.toInc(), {
      url: '/ping',
      body: '',
      headers: {},
      method: '',
    });
  });

  it('do-get', async () => {
    const app = new HttpApplication({
      verbose: true,
    }, process.cwd());
    app.mount(fn);
    const t = new HttpTestKit();
    t.GET().url('/ping');
    assert.deepEqual(await t.run(app), {});
  });

  it('do-get2', async () => {
    process.env.NODE_ENV = 'production';
    const app = new HttpApplication({},process.cwd());
    app.mount(fn);
    const t = new HttpTestKit();
    t.GET().url('/ping');
    assert.deepEqual(await t.run(app), {});
  });

  it('resStringify', () => {
    const code = 123;
    const message = 'test';
    assert.equal(
      resStringify({
        code,
        message,
      }),
      `{"code":${code},"message":"${message}"}`
    );
    assert.equal(resStringify({
      code,
      message,
      data: [],
    }), JSON.stringify({
      code,
      message,
      data: [],
    }));
  });
});