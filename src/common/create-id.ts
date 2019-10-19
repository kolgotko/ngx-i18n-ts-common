import { CallExpression, TypeChecker } from 'typescript';
import * as uuid5 from 'uuid/v5';

export const createId = (node: CallExpression, typeChecker: TypeChecker) => {
  const argumentList = node.arguments;
  const [textNode, _descNode, meaningNode, idNode] = argumentList;
  const idNodeType = typeChecker.getTypeAtLocation(idNode);

  if (idNode && idNodeType.isStringLiteral()) {
    return idNode.getText().slice(1, -1);
  } else if (meaningNode) {
    return uuid5(
      `${meaningNode.getText()}.${textNode.getText()}`,
      uuid5.DNS,
    );
  } else {
    return uuid5(
      textNode.getText(),
      uuid5.DNS,
    );
  }
}
