import { describe, it } from 'mocha';
import scanHandler from '../src/engine/service/http/faas/scanHandler';
import { assert } from 'chai';

describe('scanHandler', () => {
  it('scan', () => {
    const handlers = scanHandler(`${__dirname}/cases/src`);
    assert.equal(handlers.length, 2);
  });
});