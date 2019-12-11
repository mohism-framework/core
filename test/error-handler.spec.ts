import { assert } from 'chai';
import { describe, it } from 'mocha';
import MohismError from '../src/utils/mohism-error';
import { unifiedError } from '../src/engine/service/common/error-handler';

describe('error-handler', () => {
  it('all', () => {
    const me = new MohismError('mohism').setStatus(400).setSeq(1);
    assert.deepEqual(
      unifiedError(me),
      {
        code: 2002400001,
        message: 'mohism',
      }
    );
    assert.deepEqual(
      unifiedError(new Error('error')),
      {
        code: 2002500000,
        message: 'Internal Server Error: error'
      }
    )
  });

  it('with-appid',()=>{
    assert.deepEqual(
      unifiedError(new Error('error')),
      {
        code: 2002500000,
        message: 'Internal Server Error: error'
      }
    )
  })
});