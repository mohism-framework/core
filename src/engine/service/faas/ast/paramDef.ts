import { Dict } from '@mohism/utils/dist/libs/type';
import { parse } from '@typescript-eslint/typescript-estree';
import {
  AssignmentPattern,
  Identifier,
  Literal,
  Parameter,
  Statement,
  TSTypeParameterInstantiation,
  TypeNode,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import { readFileSync } from 'fs';
import { IParamDef, SimpleKey } from './types';

export const TsSimpleTypeMap = {
  TSAnyKeyword: 'any',
  TSBooleanKeyword: 'boolean',
  TSNumberKeyword: 'number',
  TSStringKeyword: 'string',
  TSObjectKeyword: 'object',
  TSUnknownKeyword: 'unknown',
};

export const TsMixedTypeMap = {
  TSArrayType: (elementType: string): string => `Array<${elementType}>`,
};

function getTypeName(tnode: TypeNode): string {
  if (tnode.type === 'TSTypeReference') {
    if ((tnode.typeName as Identifier).name === 'Array') {
      // 数组的泛型写法
      return TsMixedTypeMap.TSArrayType(
        getTypeName(
          (tnode.typeParameters as TSTypeParameterInstantiation).params[0],
        ),
      );
    }
    return (tnode.typeName as Identifier).name;
  } else if (tnode.type === 'TSArrayType') {
    return TsMixedTypeMap.TSArrayType(getTypeName(tnode.elementType));
  } else {
    const simpleType = tnode.type;
    return TsSimpleTypeMap[simpleType as SimpleKey] || 'unknown';
  }
}

function pickParamName(param: Parameter): IParamDef {
  const { name, typeAnnotation } =
    param.type === 'Identifier'
      ? param
      : ((param as AssignmentPattern).left as Identifier);
  if (typeAnnotation?.type === 'TSTypeAnnotation') {
    const { typeAnnotation: tAnnotation } = typeAnnotation;
    const typeName = getTypeName(tAnnotation);

    if (param.type === 'AssignmentPattern' && param.right?.type === 'Literal') {
      return { name, typeName, defaultValue: param.right.value };
    }
    return { name, typeName };
  } else {
    const defaultValue = ((param as AssignmentPattern).right as Literal).value;
    const typeName = typeof defaultValue;
    return { name, typeName, defaultValue };
  }
}

export default (filepath: string): Array<IParamDef> => {
  const code = readFileSync(`${filepath}`).toString();
  const ast = parse(code);
  const result: Array<IParamDef> = [];

  ast.body.forEach((stmt: Statement) => {
    switch (stmt.type) {
      case 'ExportDefaultDeclaration':
        if (stmt.declaration.type === 'ArrowFunctionExpression') {
          const { params } = stmt.declaration;
          params.forEach((param: Parameter) => {
            const def = pickParamName(param);
            result.push(def);
          });
        }
        break;
      default:
        break;
    }
  });

  return result;
};
