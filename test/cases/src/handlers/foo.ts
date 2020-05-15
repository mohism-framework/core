
import { ErrUserNotFound } from '../errors';
import { useModel } from '../../../../src/engine/service/hooks';

// foo控制器
export default async (minAge: number = 18) => {
  const row = await useModel('foo').findOne(
    {
      age: {
        $gte: minAge,
      },
    }
  );
  if (!row) {
    throw ErrUserNotFound;
  }
  return row;
};