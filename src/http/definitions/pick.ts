import LocationPick from './location_pick';
import NamePick from './name_pick';

const Pick = (name: string):LocationPick => {
  return new NamePick().name(name);
}

export default Pick;