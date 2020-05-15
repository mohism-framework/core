import { MohismError } from "@mohism/core";

export const ErrNotAllow = new MohismError('not allow').setStatus(403).setSeq(1);