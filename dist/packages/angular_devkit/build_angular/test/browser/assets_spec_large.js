"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/architect/testing");
const core_1 = require("@angular-devkit/core");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
describe('Browser Builder assets', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        const assets = {
            './src/folder/.gitkeep': '',
            './src/string-file-asset.txt': 'string-file-asset.txt',
            './src/string-folder-asset/file.txt': 'string-folder-asset.txt',
            './src/glob-asset.txt': 'glob-asset.txt',
            './src/folder/folder-asset.txt': 'folder-asset.txt',
            './src/output-asset.txt': 'output-asset.txt',
        };
        const matches = {
            './dist/string-file-asset.txt': 'string-file-asset.txt',
            './dist/string-folder-asset/file.txt': 'string-folder-asset.txt',
            './dist/glob-asset.txt': 'glob-asset.txt',
            './dist/folder/folder-asset.txt': 'folder-asset.txt',
            './dist/output-folder/output-asset.txt': 'output-asset.txt',
        };
        utils_1.host.writeMultipleFiles(assets);
        const overrides = {
            assets: [
                'src/string-file-asset.txt',
                'src/string-folder-asset',
                { glob: 'glob-asset.txt', input: 'src/', output: '/' },
                { glob: 'glob-asset.txt', input: 'src/', output: '/' },
                { glob: 'output-asset.txt', input: 'src/', output: '/output-folder' },
                { glob: '**/*', input: 'src/folder', output: '/folder' },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            // Assets we expect should be there.
            Object.keys(matches).forEach(fileName => {
                const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                expect(content).toMatch(matches[fileName]);
            });
            // .gitkeep should not be there.
            expect(utils_1.host.scopedSync().exists(core_1.normalize('./dist/folder/.gitkeep'))).toBe(false);
        })).toPromise().then(done, done.fail);
    });
    it('fails with non-absolute output path', (done) => {
        const assets = {
            './node_modules/some-package/node_modules-asset.txt': 'node_modules-asset.txt',
        };
        utils_1.host.writeMultipleFiles(assets);
        const overrides = {
            assets: [{
                    glob: '**/*', input: '../node_modules/some-package/', output: '../temp',
                }],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides)
            .subscribe(undefined, () => done(), done.fail);
        // The node_modules folder must be deleted, otherwise code that tries to find the
        // node_modules folder will hit this one and can fail.
        utils_1.host.scopedSync().delete(core_1.normalize('./node_modules'));
    });
    it('fails with non-source root input path', (done) => {
        const assets = {
            './node_modules/some-package/node_modules-asset.txt': 'node_modules-asset.txt',
        };
        utils_1.host.writeMultipleFiles(assets);
        const overrides = {
            assets: ['not-source-root/file.txt'],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides)
            .subscribe(undefined, () => done(), done.fail);
        // The node_modules folder must be deleted, otherwise code that tries to find the
        // node_modules folder will hit this one and can fail.
        utils_1.host.scopedSync().delete(core_1.normalize('./node_modules'));
    });
    it('still builds with empty asset array', (done) => {
        const overrides = {
            assets: [],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.toArray(), operators_1.tap((buildEvents) => expect(buildEvents.length).toBe(1))).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9icm93c2VyL2Fzc2V0c19zcGVjX2xhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0RBQWtFO0FBQ2xFLCtDQUE0RDtBQUM1RCw4Q0FBOEM7QUFDOUMsb0NBQW1EO0FBR25ELFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLE1BQU0sTUFBTSxHQUErQjtZQUN6Qyx1QkFBdUIsRUFBRSxFQUFFO1lBQzNCLDZCQUE2QixFQUFFLHVCQUF1QjtZQUN0RCxvQ0FBb0MsRUFBRSx5QkFBeUI7WUFDL0Qsc0JBQXNCLEVBQUUsZ0JBQWdCO1lBQ3hDLCtCQUErQixFQUFFLGtCQUFrQjtZQUNuRCx3QkFBd0IsRUFBRSxrQkFBa0I7U0FDN0MsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUErQjtZQUMxQyw4QkFBOEIsRUFBRSx1QkFBdUI7WUFDdkQscUNBQXFDLEVBQUUseUJBQXlCO1lBQ2hFLHVCQUF1QixFQUFFLGdCQUFnQjtZQUN6QyxnQ0FBZ0MsRUFB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RixZQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsTUFBTSxTQUFTLEdBQUc7WUFDaEIsTUFBTSxFQUFFLENBQUMsMEJBQTBCLENBQUM7U0FDckMsQ0FBQztRQUVGLHVCQUFhLENBQUMsWUFBSSxFQUFFLHlCQUFpQixFQUFFLFNBQVMsQ0FBQzthQUM5QyxTQUFTLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqRCxpRkFBaUY7UUFDakYsc0RBQXNEO1FBQ3RELFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNqRCxNQUFNLFNBQVMsR0FBRztZQUNoQixNQUFNLEVBQUUsRUFBRTtTQUNYLENBQUM7UUFFRix1QkFBYSxDQUFDLFlBQUksRUFBRSx5QkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQ3BELG1CQUFPLEVBQUUsRUFDVCxlQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3pELENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgcnVuVGFyZ2V0U3BlYyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QvdGVzdGluZyc7XG5pbXBvcnQgeyBub3JtYWxpemUsIHZpcnR1YWxGcyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IHRhcCwgdG9BcnJheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGJyb3dzZXJUYXJnZXRTcGVjLCBob3N0IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5cbmRlc2NyaWJlKCdCcm93c2VyIEJ1aWxkZXIgYXNzZXRzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IGFzc2V0czogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnLi9zcmMvZm9sZGVyLy5naXRrZWVwJzogJycsXG4gICAgICAnLi9zcmMvc3RyaW5nLWZpbGUtYXNzZXQudHh0JzogJ3N0cmluZy1maWxlLWFzc2V0LnR4dCcsXG4gICAgICAnLi9zcmMvc3RyaW5nLWZvbGRlci1hc3NldC9maWxlLnR4dCc6ICdzdHJpbmctZm9sZGVyLWFzc2V0LnR4dCcsXG4gICAgICAnLi9zcmMvZ2xvYi1hc3NldC50eHQnOiAnZ2xvYi1hc3NldC50eHQnLFxuICAgICAgJy4vc3JjL2ZvbGRlci9mb2xkZXItYXNzZXQudHh0JzogJ2ZvbGRlci1hc3NldC50eHQnLFxuICAgICAgJy4vc3JjL291dHB1dC1hc3NldC50eHQnOiAnb3V0cHV0LWFzc2V0LnR4dCcsXG4gICAgfTtcbiAgICBjb25zdCBtYXRjaGVzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICcuL2Rpc3Qvc3RyaW5nLWZpbGUtYXNzZXQudHh0JzogJ3N0cmluZy1maWxlLWFzc2V0LnR4dCcsXG4gICAgICAnLi9kaXN0L3N0cmluZy1mb2xkZXItYXNzZXQvZmlsZS50eHQnOiAnc3RyaW5nLWZvbGRlci1hc3NldC50eHQnLFxuICAgICAgJy4vZGlzdC9nbG9iLWFzc2V0LnR4dCc6ICdnbG9iLWFzc2V0LnR4dCcsXG4gICAgICAnLi9kaXN0L2ZvbGRlci9mb2xkZXItYXNzZXQudHh0JzogJ2ZvbGRlci1hc3NldC50eHQnLFxuICAgICAgJy4vZGlzdC9vdXRwdXQtZm9sZGVyL291dHB1dC1hc3NldC50eHQnOiAnb3V0cHV0LWFzc2V0LnR4dCcsXG4gICAgfTtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhhc3NldHMpO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgYXNzZXRzOiBbXG4gICAgICAgICdzcmMvc3RyaW5nLWZpbGUtYXNzZXQudHh0JyxcbiAgICAgICAgJ3NyYy9zdHJpbmctZm9sZGVyLWFzc2V0JyxcbiAgICAgICAgeyBnbG9iOiAnZ2xvYi1hc3NldC50eHQnLCBpbnB1dDogJ3NyYy8nLCBvdXRwdXQ6ICcvJyB9LFxuICAgICAgICB7IGdsb2I6ICdnbG9iLWFzc2V0LnR4dCcsIGlucHV0OiAnc3JjLycsIG91dHB1dDogJy8nIH0sXG4gICAgICAgIHsgZ2xvYjogJ291dHB1dC1hc3NldC50eHQnLCBpbnB1dDogJ3NyYy8nLCBvdXRwdXQ6ICcvb3V0cHV0LWZvbGRlcicgfSxcbiAgICAgICAgeyBnbG9iOiAnKiovKicsIGlucHV0OiAnc3JjL2ZvbGRlcicsIG91dHB1dDogJy9mb2xkZXInIH0sXG4gICAgICBdLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgLy8gQXNzZXRzIHdlIGV4cGVjdCBzaG91bGQgYmUgdGhlcmUuXG4gICAgICAgIE9iamVjdC5rZXlzKG1hdGNoZXMpLmZvckVhY2goZmlsZU5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKG1hdGNoZXNbZmlsZU5hbWVdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIC5naXRrZWVwIHNob3VsZCBub3QgYmUgdGhlcmUuXG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKCcuL2Rpc3QvZm9sZGVyLy5naXRrZWVwJykpKS50b0JlKGZhbHNlKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgnZmFpbHMgd2l0aCBub24tYWJzb2x1dGUgb3V0cHV0IHBhdGgnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IGFzc2V0czogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnLi9ub2RlX21vZHVsZXMvc29tZS1wYWNrYWdlL25vZGVfbW9kdWxlcy1hc3NldC50eHQnOiAnbm9kZV9tb2R1bGVzLWFzc2V0LnR4dCcsXG4gICAgfTtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhhc3NldHMpO1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgIGFzc2V0czogW3tcbiAgICAgICAgZ2xvYjogJyoqLyonLCBpbnB1dDogJy4uL25vZGVfbW9kdWxlcy9zb21lLXBhY2thZ2UvJywgb3V0cHV0OiAnLi4vdGVtcCcsXG4gICAgICB9XSxcbiAgICB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKVxuICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGRvbmUoKSwgZG9uZS5mYWlsKTtcblxuICAgIC8vIFRoZSBub2RlX21vZHVsZXMgZm9sZGVyIG11c3QgYmUgZGVsZXRlZCwgb3RoZXJ3aXNlIGNvZGUgdGhhdCB0cmllcyB0byBmaW5kIHRoZVxuICAgIC8vIG5vZGVfbW9kdWxlcyBmb2xkZXIgd2lsbCBoaXQgdGhpcyBvbmUgYW5kIGNhbiBmYWlsLlxuICAgIGhvc3Quc2NvcGVkU3luYygpLmRlbGV0ZShub3JtYWxpemUoJy4vbm9kZV9tb2R1bGVzJykpO1xuICB9KTtcblxuICBpdCgnZmFpbHMgd2l0aCBub24tc291cmNlIHJvb3QgaW5wdXQgcGF0aCcsIChkb25lKSA9PiB7XG4gICAgY29uc3QgYXNzZXRzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICcuL25vZGVfbW9kdWxlcy9zb21lLXBhY2thZ2Uvbm9kZV9tb2R1bGVzLWFzc2V0LnR4dCc6ICdub2RlX21vZHVsZXMtYXNzZXQudHh0JyxcbiAgICB9O1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKGFzc2V0cyk7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgYXNzZXRzOiBbJ25vdC1zb3VyY2Utcm9vdC9maWxlLnR4dCddLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpXG4gICAgICAuc3Vic2NyaWJlKHVuZGVmaW5lZCwgKCkgPT4gZG9uZSgpLCBkb25lLmZhaWwpO1xuXG4gICAgLy8gVGhlIG5vZGVfbW9kdWxlcyBmb2xkZXIgbXVzdCBiZSBkZWxldGVkLCBvdGhlcndpc2UgY29kZSB0aGF0IHRyaWVzIHRvIGZpbmQgdGhlXG4gICAgLy8gbm9kZV9tb2R1bGVzIGZvbGRlciB3aWxsIGhpdCB0aGlzIG9uZSBhbmQgY2FuIGZhaWwuXG4gICAgaG9zdC5zY29wZWRTeW5jKCkuZGVsZXRlKG5vcm1hbGl6ZSgnLi9ub2RlX21vZHVsZXMnKSk7XG4gIH0pO1xuXG4gIGl0KCdzdGlsbCBidWlsZHMgd2l0aCBlbXB0eSBhc3NldCBhcnJheScsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgYXNzZXRzOiBbXSxcbiAgICB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdG9BcnJheSgpLFxuICAgICAgdGFwKChidWlsZEV2ZW50cykgPT4gZXhwZWN0KGJ1aWxkRXZlbnRzLmxlbmd0aCkudG9CZSgxKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xufSk7XG4iXX0=