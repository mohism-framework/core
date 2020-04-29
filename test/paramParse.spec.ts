import { assert } from 'chai';

import { Parser } from '../src/engine/service/http/paramParser';
import { IIncoming } from '../src/engine/service/http/paramParser/IContext';


describe('paramParse', () => {
  it('parseBody-content-type', () => {
    const req: IIncoming = {
      url: '/',
      body: '{"a":123}',
      headers: {
        'content-type': 'text/plain'
      },
      method: '',
    };
    try {
      Parser(req)
    } catch (e) {
      assert.equal(e.message, 'bad request, only support application/json');
    }
  });

  it('parseBody-bad-json', () => {
    const req: IIncoming = {
      url: '/',
      body: 'not_a_json',
      headers: {},
      method: '',
    };
    try {
      Parser(req)
    } catch (e) {
      assert.equal(e.message, 'bad request, invalid json');
    }
  });

  it('parseQuery', () => {
    const req: IIncoming = {
      url: '/?a=1&b',
      body: '',
      headers: {},
      method: '',
    };

    assert.deepEqual(Parser(req), {
      path: '/',
      body: {},
      headers: {},
      query: { a: '1' },
      cookie: {},
      param: {}
    });
  });

  it('parseCookie', () => {
    const req: IIncoming = {
      url: '/?a=1&b',
      body: '',
      headers: {
        cookie:'a=1; b'
      },
      method: '',
    };

    assert.deepEqual(Parser(req), {
      path: '/',
      body: {},
      headers: {
        cookie:'a=1; b'
      },
      query: { a: '1' },
      cookie: {
        a:'1'
      },
      param: {}
    });
  });
});