import {IDefinition} from './iDefinition';
import { Dict } from '@mohism/utils';
import StringDefinition from './string.def';
import { EL_TYPE } from '../constant';
import NumberDefinition from './number.def';
import CommonDefinition from './common.def';

export default class TypePicker implements IDefinition {
  data: Dict<any>;

  constructor(newData?: Dict<any>) {
    this.data = newData || {} as Dict<any>;
  }

  string(): StringDefinition {
    this.data.type = EL_TYPE.STRING;
    return new StringDefinition(this.data);
  }

  number(): NumberDefinition {
    this.data.type = EL_TYPE.NUMBER;
    return new NumberDefinition(this.data);
  }

  boolean(): CommonDefinition {
    this.data.type = EL_TYPE.BOOLEAN;
    return new CommonDefinition(this.data);
  }
}