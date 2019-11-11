import { describe, it } from 'mocha';
import {expect} from 'chai';
import MohismError from './mohism-error';

describe('mohism-error-test', () => {
  it('test1', () => {
    const e = new MohismError('testcase');
    expect(e.message).is.string;
    expect(e.status).is.gte(500);
  });
});