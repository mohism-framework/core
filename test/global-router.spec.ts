import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import { Swagger, Health, Metrics } from '../src/engine/service/http/globalRoute';
import { HTTP_METHODS } from '../src/engine/service/http/constant';


describe('global-route', () => {
  it('swagger', async () => {
    assert.deepEqual([
      Swagger.method(),
      Swagger.middlewares(),
      Swagger.name(),
      Swagger.params(),
      Swagger.path(),
    ], [
      HTTP_METHODS.GET,
      [],
      'swagger api',
      {},
      '/_swagger',
    ]);

    try {
      await Swagger.run();
    } catch (e: unknown) {
      assert.equal((e as Error).message, '类型 ? 不支持生成swagger');
    }
    const realCwd = process.cwd();
    process.chdir(`${process.cwd()}/test/cases`);
    const data = await Swagger.run();
    expect(JSON.parse(data)).is.haveOwnProperty('swagger');
    process.chdir(realCwd);
  });

  it('health', async () => {
    assert.deepEqual([
      Health.method(),
      Health.middlewares(),
      Health.name(),
      Health.params(),
      Health.path(),
    ], [
      HTTP_METHODS.GET,
      [],
      'health check',
      {},
      '/_health',
    ]);

    assert.deepEqual(await Health.run(), {});
  });

  it('metrics', async () => {
    assert.deepEqual([
      Metrics.method(),
      Metrics.middlewares(),
      Metrics.name(),
      Metrics.params(),
      Metrics.path(),
    ], [
      HTTP_METHODS.GET,
      [],
      'metrics',
      {},
      '/_metrics',
    ]);
    const resp = await Metrics.run()
    expect(resp).is.haveOwnProperty('hostname');
    expect(resp).is.haveOwnProperty('memory(%)');
    expect(resp).is.haveOwnProperty('cpu(%)');
  });
});