import MohismError from "../../../../src/utils/mohism-error";

export const ErrNotAllow = new MohismError('not allow').setStatus(403).setSeq(1);