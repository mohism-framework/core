import { describe, it } from 'mocha';
import MohismError from '../src/utils/mohism-error';
import { assert } from 'chai';

describe('mohism-error', () => {
  it('all', () => {
    const r: MohismError = new MohismError('test error').statusCode(251);
    assert.deepEqual(r.output(), {
      message: 'test error',
      status: 251,
    });
  })
});