import { IDefinition } from "./iDefinition";
import { Dict } from '../../utils/globalType';
import LocationPick from './location_pick';

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