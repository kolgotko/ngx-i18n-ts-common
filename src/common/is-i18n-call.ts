import { isCallExpression, isIdentifier, Node, TypeChecker } from 'typescript';
import { needleName, needleTypeName } from './constants';

export const isI18nCall = (node: Node, checker: TypeChecker): boolean => {
  if (isCallExpression(node)) {
    const expression = node.expression;

    if (isIdentifier(expression) && expression.escapedText === needleName) {
      const typeObj = checker.getTypeAtLocation(node.expression);
      const typeName = checker.typeToString(typeObj);

      if (typeName === needleTypeName) {
        return true;
      }
    }
  }

  return false;
}
