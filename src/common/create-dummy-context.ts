import { Program, TransformationContext } from 'typescript';

const emptyCall = () => {};

export const createDummyContext = (program: Program) => {
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
    } as TransformationContext;
};
