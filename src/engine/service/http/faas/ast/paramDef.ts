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

import { IParamDef, SimpleKey, IComment } from './types';
import { Dict } from '@mohism/utils';

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

function pickParamName(param: Parameter, comment: IComment): IParamDef {
  const { name, typeAnnotation } =
    param.type === 'Identifier'
      ? param
      : ((param as AssignmentPattern).left as Identifier);
  if (typeAnnotation?.type === 'TSTypeAnnotation') {
    const { typeAnnotation: tAnnotation } = typeAnnotation;
    const typeName = getTypeName(tAnnotation);

    if (param.type === 'AssignmentPattern' && param.right?.type === 'Literal') {
      return {
        name,
        typeName,
        defaultValue: param.right.value,
        comment: comment.params ? comment.params[name] : '',
      };
    }
    return {
      name,
      typeName,
      comment: comment.params ? comment.params[name] : '',
    };
  } else {
    const defaultValue = ((param as AssignmentPattern).right as Literal).value;
    const typeName = typeof defaultValue;
    return {
      name,
      typeName,
      defaultValue,
      comment: comment.params ? comment.params[name] : '',
    };
  }
}

function formatComment(blockComment: string): {
  comment: string;
  params?: Dict<string>;
} {
  const result: {
    comment: string;
    params: Dict<string>;
  } = {
    comment: '',
    params: {},
  };
  const lines = blockComment.replace(/\*/g, '').split(/\n/i);
  lines.forEach((line: string) => {
    const plain = line.trim();
    if (!plain) {
      return;
    }
    if (plain.startsWith('@param')) {
      const [_, field, ...rest] = plain.split(' ');
      result.params[field] = rest.join(' ');
    } else {
      result.comment += plain;
    }
  });

  return result;
}

function nearbyComment(comments: Array<IComment>, stmt: Statement): IComment {
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].end < stmt.loc.start.line) {
      return comments[i];
    }
  }
  return {
    comment: '',
    start: 0,
    end: 0,
  };
}

export default (code: string): [Array<IParamDef>, IComment] => {
  const ast = parse(code, {
    comment: true,
    loc: true,
    range: false,
  });
  const comments: Array<IComment> = [];
  let specComment: IComment = {
    comment: '',
    start: 0,
    end: 0,
  };
  ast.comments.forEach(c => {
    if (c.type === 'Block') {
      comments.push({
        ...formatComment(c.value),
        start: c.loc.start.line,
        end: c.loc.end.line,
      });
    } else {
      comments.push({
        comment: c.value.trim(),
        start: c.loc.start.line,
        end: c.loc.end.line,
      });
    }
  });
  const result: Array<IParamDef> = [];
  ast.body.forEach((stmt: Statement) => {
    switch (stmt.type) {
      case 'ExportDefaultDeclaration':
        specComment = nearbyComment(comments, stmt);

        // 直接export function
        if (stmt.declaration.type === 'ArrowFunctionExpression') {
          const { params } = stmt.declaration;
          params.forEach((param: Parameter) => {
            const def = pickParamName(param, specComment);
            result.push(def);
          });
        }
        if (stmt.declaration.type === 'FunctionDeclaration') {
          const { params } = stmt.declaration;
          params.forEach((param: Parameter) => {
            const def = pickParamName(param, specComment);
            result.push(def);
          });
        }
        // todo 先定义function，再export
        break;
    }
  });

  return [result, specComment];
};
