import { Tree } from './interface';
export interface VisitTestVisitSpec {
    root: string;
    expected?: string[];
    exception?: (spec: {
        path: string;
    }) => Error;
    focus?: boolean;
}
export interface VisitTestSet {
    name: string;
    files: string[];
    visits: VisitTestVisitSpec[];
    focus?: boolean;
}
export interface VisitTestSpec {
    createTree: (paths: string[]) => Tree;
    sets: VisitTestSet[];
}
export declare function testTreeVisit({ createTree, sets }: VisitTestSpec): void;
