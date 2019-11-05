import { IDefinition } from "./iDefinition";
import { Dict } from '@mohism/utils';
import { HTTP_PARAM_LOCATION } from '../constant/index';
import TypePicker from './type_pick';

export default class LocationPick implements IDefinition {
  data: Dict<any>;

  constructor(newData: Dict<any>) {
    this.data = newData || {} as Dict<any>;
  }

  in(location: HTTP_PARAM_LOCATION): TypePicker {
    this.data.in = location;
    return new TypePicker(this.data);
  }
}