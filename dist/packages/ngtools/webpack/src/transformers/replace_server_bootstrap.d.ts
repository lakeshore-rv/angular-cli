import * as ts from 'typescript';
export declare function replaceServerBootstrap(shouldTransform: (fileName: string) => boolean, getEntryModules: () => {
    path: string;
    className: string;
}[] | null, getTypeChecker: () => ts.TypeChecker): ts.TransformerFactory<ts.SourceFile>;
