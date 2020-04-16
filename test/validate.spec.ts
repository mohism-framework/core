import { assert, expect } from 'chai';
import { describe, it } from 'mocha';

import { EL_TYPE } from '../src/engine/service/common/constant';
import { HTTP_PARAM_LOCATION } from '../src/engine/service/http/constant';
import HttpPick from '../src/engine/service/http/paramDefinition/httpPick';
import { IContext } from '../src/engine/service/http/paramParser/IContext';
import { toType, validate } from '../src/engine/service/http/validate';


describe('validate', () => {
  it('toType::zerovalue', () => {
    assert.equal(toType(null, EL_TYPE.BOOLEAN), null);
  });
  it('toType::number', () => {
    assert.equal(toType('123', EL_TYPE.NUMBER), 123);
    expect(toType('sss', EL_TYPE.NUMBER)).instanceOf(Error);
  });
  it('toType::string', () => {
    assert.equal(toType('123', EL_TYPE.STRING), '123');
  });
  it('toType::boolean', () => {
    assert.equal(toType('true', EL_TYPE.BOOLEAN), true);
    assert.equal(toType(true, EL_TYPE.BOOLEAN), true);
    assert.equal(toType('false', EL_TYPE.BOOLEAN), false);
    assert.equal(toType(false, EL_TYPE.BOOLEAN), false);
    expect(toType('sss', EL_TYPE.BOOLEAN)).instanceOf(Error);
  });

  it('validate_default', () => {
    const rules = {
      name: HttpPick('name').in(HTTP_PARAM_LOCATION.QUERY).string().default('lucy'),
      lastname: HttpPick('lastname').in(HTTP_PARAM_LOCATION.QUERY).string().default('Brown'),
    };
    const ctx: IContext = {
      path: '',
      query: {
        lastname: 'Moo'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    assert.deepEqual(validate(ctx, rules), { name: 'lucy', lastname: 'Moo' });
  });
  it('validate_contains', () => {
    const rules = {
      email: HttpPick('email').in(HTTP_PARAM_LOCATION.QUERY).string().contains('@')
    };
    const ctx: IContext = {
      path: '',
      query: {
        email: 'not_contains_at'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: email must contains \'@\'')
    }
  });

  it('validate_exclude', () => {
    const rules = {
      fav: HttpPick('fav').in(HTTP_PARAM_LOCATION.QUERY).string().not(['arsenal', 'chelsea'])
    };
    const ctx: IContext = {
      path: '',
      query: {
        fav: 'arsenal'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: fav should NOT be one of ["arsenal","chelsea"]')
    }
  });

  it('validate_choices', () => {
    const rules = {
      fav: HttpPick('fav').in(HTTP_PARAM_LOCATION.QUERY).string().isIn(['arsenal', 'chelsea'])
    };
    const ctx: IContext = {
      path: '',
      query: {
        fav: 'milan'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: fav must be one of ["arsenal","chelsea"]')
    }
  });

  it('validate_length_1', () => {
    const rules = {
      name: HttpPick('name').in(HTTP_PARAM_LOCATION.QUERY).string().length(5, 10)
    };
    const ctx: IContext = {
      path: '',
      query: {
        name: 'Tom'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: name length must in [5,10]')
    }
  });

  it('validate_length_2', () => {
    const rules = {
      name: HttpPick('name').in(HTTP_PARAM_LOCATION.QUERY).string().length(5, 10)
    };
    const ctx: IContext = {
      path: '',
      query: {
        name: 'Tommy andrew'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: name length must in [5,10]')
    }
  });

  it('validate_range_1', () => {
    const rules = {
      long: HttpPick('long').in(HTTP_PARAM_LOCATION.QUERY).number().gt(10),
    };
    const ctx: IContext = {
      path: '',
      query: {
        long: 10,
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: long must gt 10')
    }
  });

  it('validate_range_2', () => {
    const rules = {
      width: HttpPick('width').in(HTTP_PARAM_LOCATION.QUERY).number().gte(11),
    };
    const ctx: IContext = {
      path: '',
      query: {
        width: 10,
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: width must gte 11')
    }
  });

  it('validate_range_3', () => {
    const rules = {
      heigh: HttpPick('heigh').in(HTTP_PARAM_LOCATION.QUERY).number().lt(20),
    };
    const ctx: IContext = {
      path: '',
      query: {
        heigh: 20,
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: heigh must lt 20')
    }
  });

  it('validate_range_4', () => {
    const rules = {
      depth: HttpPick('depth').in(HTTP_PARAM_LOCATION.QUERY).number().lte(21),
    };
    const ctx: IContext = {
      path: '',
      query: {
        depth: 22,
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Validation Error: depth must lte 21')
    }
  });

  it('validate_required', () => {
    const rules = {
      name: HttpPick('name').in(HTTP_PARAM_LOCATION.QUERY).string().required()
    };
    const ctx: IContext = {
      path: '',
      query: {},
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'Required query.name')
    }
  });

  it('validate_type_error', () => {
    const rules = {
      age: HttpPick('age').in(HTTP_PARAM_LOCATION.QUERY).number()
    };
    const ctx: IContext = {
      path: '',
      query: {
        age: 'not_a_number'
      },
      body: {},
      headers: {},
      cookie: {},
      param: {},
    };
    try {
      validate(ctx, rules)
    } catch (e) {
      assert.equal(e.message, 'query.age must be NUMBER')
    }
  });
});