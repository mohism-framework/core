import { IDefinition } from '../../common/param-definition/IDefinition';
import { Dict } from '@mohism/utils';

import TypePicker from '../../common/param-definition/typePick';
import { HTTP_PARAM_LOCATION } from '../constant';

export default class LocationPick implements IDefinition {
  data: Dict<any>;

  constructor(newData?: Dict<any>) {
    this.data = newData || {} as Dict<any>;
  }

  in(location: HTTP_PARAM_LOCATION): TypePicker {
    this.data.in = location;
    return new TypePicker(this.data);
  }
}