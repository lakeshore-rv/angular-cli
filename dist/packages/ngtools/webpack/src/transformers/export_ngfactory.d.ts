import * as ts from 'typescript';
export declare function exportNgFactory(shouldTransform: (fileName: string) => boolean, getEntryModules: () => {
    path: string;
    className: string;
}[] | null): ts.TransformerFactory<ts.SourceFile>;
