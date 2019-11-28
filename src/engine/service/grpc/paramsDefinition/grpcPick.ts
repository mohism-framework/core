import TypePicker from '../../common/param-definition/typePick';
import NamePick from './namePick';

const Pick = (name: string): TypePicker => {
  return new NamePick().name(name);
}

export default Pick;