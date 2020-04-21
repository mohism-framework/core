import { IParamDef } from "./ast/types"
import { Dict } from '@mohism/utils/dist/libs/type';
import { IDefinition } from '../common/param-definition/IDefinition'
import HttpPick from '../http/paramDefinition/httpPick';
import { HTTP_METHODS, HTTP_PARAM_LOCATION } from '../http/constant';
import LocationPick from "../http/paramDefinition/locationPick";
import CommonDefinition from "../common/param-definition/common.def";
import TypePicker from "../common/param-definition/typePick";

const { GET } = HTTP_METHODS;
const { QUERY, BODY } = HTTP_PARAM_LOCATION;
/**
 * translate IParamDef to IDefinition
 */
export const transform = (paramDefs: Array<IParamDef>, method: HTTP_METHODS = GET): Dict<IDefinition> => {
  const definitions: Dict<IDefinition> = {};
  paramDefs.forEach((paramDef: IParamDef) => {
    const {
      name,
      typeName,
      defaultValue,
    } = paramDef;
    let def: IDefinition = HttpPick(name);
    if (method === GET) {
      def = (def as LocationPick).in(QUERY);
    } else {
      def = (def as LocationPick).in(BODY);
    }
    switch (typeName) {
      case 'number':
        def = (def as TypePicker).number();
        break;
      case 'boolean':
        def = (def as TypePicker).boolean();
        break;
      default:
        def = (def as TypePicker).string();
    }
    if (defaultValue !== undefined) {
      def = (def as CommonDefinition).default(defaultValue);
    } else {
      def = (def as CommonDefinition).required();
    }
    definitions[name] = def;
  });

  return definitions;
}