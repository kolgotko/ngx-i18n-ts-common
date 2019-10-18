import * as ts from 'typescript';
import * as uuid5 from 'uuid/v5';
import * as fs from 'fs';
import * as xmljs from 'xml-js';
import { get, keyBy } from 'lodash';

const emptyCall = () => {};
export const needleName = 'i18n';
export const needleTypeName = '<T>(value: T, _desc?: string, _meaning?: string, _id?: string) => T';
export const createDummyContext = (program: ts.Program) => {
    return {
        getCompilerOptions: () => program.getCompilerOptions(),
        startLexicalEnvironment: emptyCall,
        suspendLexicalEnvironment: emptyCall,
        resumeLexicalEnvironment: emptyCall,
        endLexicalEnvironment: () => [],
        hoistFunctionDeclaration: emptyCall,
        hoistVariableDeclaration: emptyCall,
        requestEmitHelper: emptyCall,
        readEmitHelpers: () => [],
        enableSubstitution: emptyCall,
        isSubstitutionEnabled: () => false,
        onSubstituteNode: (_hint, node) => node,
        enableEmitNotification: emptyCall,
        isEmitNotificationEnabled: () => false,
        onEmitNode: emptyCall,
    } as ts.TransformationContext;
};

export const isI18nCall = (node: ts.Node, checker: ts.TypeChecker): boolean => {
    if (ts.isCallExpression(node)) {
        const expression = node.expression;

        if (ts.isIdentifier(expression) && expression.escapedText === needleName) {
            const typeObj = checker.getTypeAtLocation(node.expression);
            const typeName = checker.typeToString(typeObj);

            if (typeName === needleTypeName) {
                return true;
            }
        }
    }

    return false;
}

export const createId = (node: ts.CallExpression, typeChecker: ts.TypeChecker) => {
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

export const loadTransUnitMap = (file: string) => {
  const xml = fs.readFileSync(file, 'utf8');
  const xliffParsed = xmljs.xml2js(xml);
  const transUnitList = get(xliffParsed, 'elements[0].elements[0].elements[0].elements', []);

  return keyBy(transUnitList, unit => unit.attributes.id);
}
