import { describe, it } from 'mocha';
import { expect } from 'chai';
import { MohismError } from '../src';

describe('mohism-error-test', () => {
  it('base', () => {
    const e = new MohismError('testcase');
    expect(e.message).is.string;
    expect(e.status).is.gte(500);
  });
  it('set code', () => {
    const e = new MohismError('testcase');
    e.statusCode(404);
    expect(e.status).to.eq(404);
  });
});