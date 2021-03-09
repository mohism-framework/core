import { ICronexpr } from '../../../../src/engine/service/cron/type';

export default {
  name: 'five-seconds',
  expr: '*/5 * * * * *',
  immediate: false,
  func: async () => {
    console.log('running every five seconds');
  }
} as ICronexpr;