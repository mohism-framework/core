import LocationPick from './locationPick';
import NamePick from './namePick';

const Pick = (name: string): LocationPick => {
  return new NamePick().name(name);
}

export default Pick;