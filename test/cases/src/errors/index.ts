import MohismError from "../../../../src/utils/mohism-error";
import { HTTP_STATUS } from "../../../../src/engine/service/http/statusCode";

const { NotFound } = HTTP_STATUS;

export const ErrUserNotFound = new MohismError('user not found')
  .setStatus(NotFound)
  .setSeq(1);
