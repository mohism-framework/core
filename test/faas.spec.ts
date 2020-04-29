import { assert } from 'chai';
import { describe, it } from 'mocha';

import parse from '../src/engine/service/http/faas/ast/paramDef';
import { transform } from '../src/engine/service/http/faas/transform';
import { HTTP_METHODS, HTTP_PARAM_LOCATION } from '../src/engine/service/http/constant';



describe('faas', () => {
  it('faas-paramDef', () => {
    const code = `
    interface II {}
    export default async(name:string='test',age=18,foo:string,bar:string[],baz:Array<string>,gaz:II)=>{}
    `;
    assert.deepEqual(parse(code), [
      { name: 'name', typeName: 'string', defaultValue: 'test' },
      { name: 'age', typeName: 'number', defaultValue: 18 },
      { name: 'foo', typeName: 'string' },
      { name: 'bar', typeName: 'Array<string>' },
      { name: 'baz', typeName: 'Array<string>' },
      { name: 'gaz', typeName: 'II' },
    ]);
  });

  it('faas-transform', () => {
    const code = `export default async(name:string,age=18,foo:boolean)=>{}`;
    assert.deepEqual(
      transform(parse(code), HTTP_METHODS.GET),
      {
        name: {
          data: {
            name: 'name',
            in: HTTP_PARAM_LOCATION.QUERY,
            type: 2,
            required: true,
          }
        },
        foo: {
          data: {
            name: 'foo',
            in: HTTP_PARAM_LOCATION.QUERY,
            type: 3,
            required: true,
          }
        },
        age: {
          data: {
            name: 'age',
            in: HTTP_PARAM_LOCATION.QUERY,
            type: 1,
            optional: true,
            default: 18,
          }
        },
      }
    );
    const code2 = `export default async(name:string)=>{}`;
    assert.deepEqual(
      transform(parse(code2), HTTP_METHODS.POST),
      {
        name: {
          data: {
            name: 'name',
            in: HTTP_PARAM_LOCATION.BODY,
            type: 2,
            required: true,
          }
        },
      }
    );
  });
});