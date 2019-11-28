import { assert } from 'chai';
import { describe } from 'mocha';

import { EL_TYPE } from '../src/engine/service/common/constant';
import CommonDefinition from '../src/engine/service/common/param-definition/common.def';
import NumberDefinition from '../src/engine/service/common/param-definition/number.def';
import StringDefinition from '../src/engine/service/common/param-definition/string.def';
import TypePicker from '../src/engine/service/common/param-definition/typePick';
import GrpcPick from '../src/engine/service/grpc/paramsDefinition/grpcPick';
import { HTTP_PARAM_LOCATION } from '../src/engine/service/http/constant';
import HttpPick from '../src/engine/service/http/paramDefinition/httpPick';
import LocationPick from '../src/engine/service/http/paramDefinition/locationPick';

describe('paramDefinition', () => {

  it('pick:name', () => {
    const p = HttpPick('foo');
    assert.deepEqual(p.data, {
      name: 'foo'
    });
  });

  it('pick:location', () => {
    const p = new LocationPick().in(HTTP_PARAM_LOCATION.BODY);
    assert.deepEqual(p.data, {
      in: HTTP_PARAM_LOCATION.BODY,
    });
  });

  it('pick:type', () => {
    const p = GrpcPick('foo').number();
    assert.deepEqual(p.data, {
      name: 'foo',
      type: EL_TYPE.NUMBER
    });
    const p2 = GrpcPick('foo').string();
    assert.deepEqual(p2.data, {
      name: 'foo',
      type: EL_TYPE.STRING
    });
    const p3 = new TypePicker();
    p3.boolean();
    assert.deepEqual(p3.data, {
      type: EL_TYPE.BOOLEAN,
    });
  });

  it('pick:number:gt/gte', () => {
    // gt
    const p1 = new NumberDefinition();
    p1.gt(10);
    assert.deepEqual(p1.data, {
      range: {
        min: {
          n: 10,
          e: false,
        }
      }
    });
    // gte
    const p2 = new NumberDefinition();
    p2.gte(10);
    assert.deepEqual(p2.data, {
      range: {
        min: {
          n: 10,
          e: true,
        }
      }
    });
  });

  it('pick:number:lt/te', () => {
    // lt
    const p1 = new NumberDefinition();
    p1.lt(10);
    assert.deepEqual(p1.data, {
      range: {
        max: {
          n: 10,
          e: false,
        }
      }
    });
    // lte
    const p2 = new NumberDefinition();
    p2.lte(10);
    assert.deepEqual(p2.data, {
      range: {
        max: {
          n: 10,
          e: true,
        }
      }
    });
  });

  it('pick:string:length', () => {
    const p = new StringDefinition();
    p.length(10, 20);
    assert.deepEqual(p.data, {
      length: [10, 20]
    });
    const p2 = new StringDefinition();
    p.length();
    assert.deepEqual(p.data, {
      length: [0, Number.MAX_SAFE_INTEGER]
    });
  });

  it('pick:string:contains', () => {
    const p = new StringDefinition();
    p.contains('@');
    assert.deepEqual(p.data, {
      contains: '@'
    });
  });

  it('pick:common:default', () => {
    const p = new CommonDefinition();
    p.default('foo');
    assert.deepEqual(p.data, {
      default: 'foo',
      optional: true,
    });
  });

  it('pick:common:isin', () => {
    const p = new CommonDefinition();
    p.isIn([1, 2, 3]);
    assert.deepEqual(p.data, {
      choices: [1, 2, 3]
    });
  });

  it('pick:common:notin', () => {
    const p = new CommonDefinition();
    p.not([3, 2, 1]);
    assert.deepEqual(p.data, {
      excludes: [3, 2, 1]
    });
  });

  it('pick:common:required', () => {
    const p = new CommonDefinition();
    p.required();
    assert.deepEqual(p.data, {
      required: true,
    });
  });

  // end
});