import { Dict } from '@mohism/utils';

import { IDefinition } from '../../common/param-definition/IDefinition';
import TypePicker from '../../common/param-definition/typePick';


export default class NamePick implements IDefinition {
  data: Dict<any>;

  constructor(newData?: Dict<any>) {
    this.data = newData || {} as Dict<any>;
  }

  name(n: string): TypePicker {
    this.data.name = n;
    return new TypePicker(this.data);
  }
}