import { Dict } from '@mohism/utils';

import { IDefinition } from '../../common/param-definition/IDefinition';
import LocationPick from './locationPick';

export default class NamePick implements IDefinition {
  data: Dict<any>;

  constructor(newData?: Dict<any>) {
    this.data = newData || {} as Dict<any>;
  }

  name(n: string): LocationPick {
    this.data.name = n;
    return new LocationPick(this.data);
  }
}