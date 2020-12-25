import { expect } from 'chai';
import { describe, it } from 'mocha';

import { genSwagger } from '../src/engine/service/http/swagger';

describe('gen-swagger', () => {
  it('gen-swagger-all', () => {
    const result = genSwagger(`${__dirname}/cases`);
    expect(result).is.haveOwnProperty('swagger');
  });
});