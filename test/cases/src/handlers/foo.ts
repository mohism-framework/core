
import { ErrUserNotFound } from '../errors';
import { useModel } from '../../../../src/engine/service/hooks';

/**
 * foo控制器
 * @param minAge 最低年龄
 */
export default async function (minAge: number = 18)  {
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