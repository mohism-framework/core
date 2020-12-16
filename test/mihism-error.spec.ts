import { describe, it } from 'mocha';
import MohismError from '../src/utils/mohism-error';
import { assert } from 'chai';

describe('mohism-error', () => {
  it('all', () => {
    const r: MohismError = new MohismError('test error').setStatus(251).setSeq(2).setDetail('detail');
    assert.deepEqual(r.output(), {
      code: 2,
      message: 'test error: detail',
      status: 251,
    });
  });

  it('getStatus', () => {
    const r: MohismError = new MohismError('test error').setStatus(251).setSeq(2);
    assert.equal(r.getStatus(), 251);
  });
});