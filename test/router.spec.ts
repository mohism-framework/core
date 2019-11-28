import { describe, it } from 'mocha';
import { Route } from '../src/engine/service/http/router';
import { HTTP_METHODS } from '../src/engine/service/http/constant';
import { assert, expect } from 'chai';
import { IHandler } from '../src/engine/service/common/IHandler';
import {IDefinition} from '../src/engine/service/common/param-definition/IDefinition';
import { Dict } from '@mohism/utils';

const fn: IHandler = {
  path: () => '',
  middlewares: () => [],
  params: () => { return {} as Dict<IDefinition> },
  run: async () => { }
};

describe('router', () => {
  it('router::add', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    r.register(HTTP_METHODS.GET, '/a/{number}/d', fn);
    assert.equal(r.treeToString(), '{"GET":{"name":"GET","next":{"a":{"name":"a","next":{"*":{"name":"*","next":{"c":{"name":"c","next":{},"handler":{}},"d":{"name":"d","next":{},"handler":{}}}}}}}}}');
  });

  it('router::fetch1', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    expect(r.fetch.bind(r, 'GET', '/a/456/d')).to.throw('not found');
  });

  it('router::fetch2', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    expect(r.fetch.bind(r, 'GET', '/a/456/c')).not.throws();
  });

  it('router::fetch3', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    expect(r.fetch.bind(r, 'GET', '/a/123/c')).not.throws();
  });

  it('router::fetch4', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    expect(r.fetch.bind(r, 'GET', '/a/123/d')).not.throws();
  });

  it('router::fetch5', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    expect(r.fetch.bind(r, 'GET', '/a/123/c/d')).to.throw('not found');
  });

  it('router::fetch6', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number/c', fn);
    expect(r.fetch.bind(r, 'GET', '/')).to.throw('not found');
    expect(r.fetch.bind(r, 'GET', '')).to.throw('not found');
  });

  it('router::fetch7', () => {
    const r = Route();

    r.register(HTTP_METHODS.GET, '/a/123/d', fn);
    r.register(HTTP_METHODS.GET, '/a/:number', fn);

    expect(r.fetch.bind(r, 'GET', '/a/123')).not.throws();
  });
});