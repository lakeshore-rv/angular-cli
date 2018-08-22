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
describe('Browser Builder file replacements', () => {
    const outputPath = core_1.normalize('dist');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    beforeEach(() => utils_1.host.writeMultipleFiles({
        'src/meaning-too.ts': 'export var meaning = 42;',
        'src/meaning.ts': `export var meaning = 10;`,
        'src/main.ts': `
        import { meaning } from './meaning';

        console.log(meaning);
      `,
    }));
    it('allows file replacements', (done) => {
        const overrides = {
            fileReplacements: [
                {
                    replace: core_1.normalize('/src/meaning.ts'),
                    with: core_1.normalize('/src/meaning-too.ts'),
                },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'main.js');
            expect(core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName)))
                .toMatch(/meaning\s*=\s*42/);
            expect(core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName)))
                .not.toMatch(/meaning\s*=\s*10/);
        })).toPromise().then(done, done.fail);
    });
    it(`allows file replacements with deprecated format`, (done) => {
        const overrides = {
            fileReplacements: [
                {
                    src: core_1.normalize('/src/meaning.ts'),
                    replaceWith: core_1.normalize('/src/meaning-too.ts'),
                },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'main.js');
            expect(core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName)))
                .toMatch(/meaning\s*=\s*42/);
            expect(core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName)))
                .not.toMatch(/meaning\s*=\s*10/);
        })).toPromise().then(done, done.fail);
    });
    it(`fails compilation with missing 'replace' file`, (done) => {
        const overrides = {
            fileReplacements: [
                {
                    replace: core_1.normalize('/src/meaning.ts'),
                    with: core_1.normalize('/src/meaning-three.ts'),
                },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides)
            .subscribe(undefined, () => done(), done.fail);
    });
    it(`fails compilation with missing 'with' file`, (done) => {
        const overrides = {
            fileReplacements: [
                {
                    replace: core_1.normalize('/src/meaning-three.ts'),
                    with: core_1.normalize('/src/meaning-too.ts'),
                },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides)
            .subscribe(undefined, () => done(), done.fail);
    });
    it('file replacements work with watch mode', (done) => {
        const overrides = {
            fileReplacements: [
                {
                    replace: core_1.normalize('/src/meaning.ts'),
                    with: core_1.normalize('/src/meaning-too.ts'),
                },
            ],
            watch: true,
        };
        let buildNumber = 0;
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, 45000).pipe(operators_1.debounceTime(1000), operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'main.js');
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName));
            buildNumber += 1;
            switch (buildNumber) {
                case 1:
                    expect(content).toMatch(/meaning\s*=\s*42/);
                    expect(content).not.toMatch(/meaning\s*=\s*10/);
                    utils_1.host.writeMultipleFiles({
                        'src/meaning-too.ts': 'export var meaning = 84;',
                    });
                    break;
                case 2:
                    expect(content).toMatch(/meaning\s*=\s*84/);
                    expect(content).not.toMatch(/meaning\s*=\s*42/);
                    break;
            }
        }), operators_1.take(2)).toPromise().then(() => done(), done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZW1lbnRzX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9icm93c2VyL3JlcGxhY2VtZW50c19zcGVjX2xhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0RBQWtFO0FBQ2xFLCtDQUFrRTtBQUNsRSw4Q0FBeUQ7QUFDekQsb0NBQW1EO0FBR25ELFFBQVEsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7SUFDakQsTUFBTSxVQUFVLEdBQUcsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZDLG9CQUFvQixFQUFFLDBCQUEwQjtRQUNoRCxnQkFBZ0IsRUFBRSwwQkFBMEI7UUFFNUMsYUFBYSxFQUFFOzs7O09BSVo7S0FDSixDQUFDLENBQUMsQ0FBQztJQUVKLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3RDLE1BQU0sU0FBUyxHQUFHO1lBQ2hCLGdCQUFnQixFQUFFO2dCQUNoQjtvQkFDRSxPQUFPLEVBQUUsZ0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQztv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TSxPQUFPLEdBQUcsZ0JBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDL0UsV0FBVyxJQUFJLENBQUMsQ0FBQztZQUVqQixRQUFRLFdBQVcsRUFBRTtnQkFDbkIsS0FBSyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDaEQsWUFBSSxDQUFDLGtCQUFrQixDQUFDO3dCQUN0QixvQkFBb0IsRUFBRSwwQkFBMEI7cUJBQ2pELENBQUMsQ0FBQztvQkFDSCxNQUFNO2dCQUVSLEtBQUssQ0FBQztvQkFDSixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hELE1BQU07YUFDVDtRQUNILENBQUMsQ0FBQyxFQUNGLGdCQUFJLENBQUMsQ0FBQyxDQUFDLENBQ1IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIHRha2UsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGJyb3dzZXJUYXJnZXRTcGVjLCBob3N0IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5cbmRlc2NyaWJlKCdCcm93c2VyIEJ1aWxkZXIgZmlsZSByZXBsYWNlbWVudHMnLCAoKSA9PiB7XG4gIGNvbnN0IG91dHB1dFBhdGggPSBub3JtYWxpemUoJ2Rpc3QnKTtcblxuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAnc3JjL21lYW5pbmctdG9vLnRzJzogJ2V4cG9ydCB2YXIgbWVhbmluZyA9IDQyOycsXG4gICAgJ3NyYy9tZWFuaW5nLnRzJzogYGV4cG9ydCB2YXIgbWVhbmluZyA9IDEwO2AsXG5cbiAgICAnc3JjL21haW4udHMnOiBgXG4gICAgICAgIGltcG9ydCB7IG1lYW5pbmcgfSBmcm9tICcuL21lYW5pbmcnO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKG1lYW5pbmcpO1xuICAgICAgYCxcbiAgfSkpO1xuXG4gIGl0KCdhbGxvd3MgZmlsZSByZXBsYWNlbWVudHMnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgIGZpbGVSZXBsYWNlbWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6IG5vcm1hbGl6ZSgnL3NyYy9tZWFuaW5nLnRzJyksXG4gICAgICAgICAgd2l0aDogbm9ybWFsaXplKCcvc3JjL21lYW5pbmctdG9vLnRzJyksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBqb2luKG91dHB1dFBhdGgsICdtYWluLmpzJyk7XG4gICAgICAgIGV4cGVjdCh2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQoZmlsZU5hbWUpKSlcbiAgICAgICAgICAudG9NYXRjaCgvbWVhbmluZ1xccyo9XFxzKjQyLyk7XG4gICAgICAgIGV4cGVjdCh2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQoZmlsZU5hbWUpKSlcbiAgICAgICAgICAubm90LnRvTWF0Y2goL21lYW5pbmdcXHMqPVxccyoxMC8pO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBhbGxvd3MgZmlsZSByZXBsYWNlbWVudHMgd2l0aCBkZXByZWNhdGVkIGZvcm1hdGAsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgZmlsZVJlcGxhY2VtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBub3JtYWxpemUoJy9zcmMvbWVhbmluZy50cycpLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiBub3JtYWxpemUoJy9zcmMvbWVhbmluZy10b28udHMnKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGpvaW4ob3V0cHV0UGF0aCwgJ21haW4uanMnKTtcbiAgICAgICAgZXhwZWN0KHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChmaWxlTmFtZSkpKVxuICAgICAgICAgIC50b01hdGNoKC9tZWFuaW5nXFxzKj1cXHMqNDIvKTtcbiAgICAgICAgZXhwZWN0KHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChmaWxlTmFtZSkpKVxuICAgICAgICAgIC5ub3QudG9NYXRjaCgvbWVhbmluZ1xccyo9XFxzKjEwLyk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoYGZhaWxzIGNvbXBpbGF0aW9uIHdpdGggbWlzc2luZyAncmVwbGFjZScgZmlsZWAsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgZmlsZVJlcGxhY2VtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogbm9ybWFsaXplKCcvc3JjL21lYW5pbmcudHMnKSxcbiAgICAgICAgICB3aXRoOiBub3JtYWxpemUoJy9zcmMvbWVhbmluZy10aHJlZS50cycpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKVxuICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGRvbmUoKSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoYGZhaWxzIGNvbXBpbGF0aW9uIHdpdGggbWlzc2luZyAnd2l0aCcgZmlsZWAsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgZmlsZVJlcGxhY2VtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogbm9ybWFsaXplKCcvc3JjL21lYW5pbmctdGhyZWUudHMnKSxcbiAgICAgICAgICB3aXRoOiBub3JtYWxpemUoJy9zcmMvbWVhbmluZy10b28udHMnKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcylcbiAgICAgIC5zdWJzY3JpYmUodW5kZWZpbmVkLCAoKSA9PiBkb25lKCksIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdmaWxlIHJlcGxhY2VtZW50cyB3b3JrIHdpdGggd2F0Y2ggbW9kZScsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgZmlsZVJlcGxhY2VtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogbm9ybWFsaXplKCcvc3JjL21lYW5pbmcudHMnKSxcbiAgICAgICAgICB3aXRoOiBub3JtYWxpemUoJy9zcmMvbWVhbmluZy10b28udHMnKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICB3YXRjaDogdHJ1ZSxcbiAgICB9O1xuXG4gICAgbGV0IGJ1aWxkTnVtYmVyID0gMDtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcywgNDUwMDApLnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMTAwMCksXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBqb2luKG91dHB1dFBhdGgsICdtYWluLmpzJyk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQoZmlsZU5hbWUpKTtcbiAgICAgICAgYnVpbGROdW1iZXIgKz0gMTtcblxuICAgICAgICBzd2l0Y2ggKGJ1aWxkTnVtYmVyKSB7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL21lYW5pbmdcXHMqPVxccyo0Mi8pO1xuICAgICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLm5vdC50b01hdGNoKC9tZWFuaW5nXFxzKj1cXHMqMTAvKTtcbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICAgICAgICAgJ3NyYy9tZWFuaW5nLXRvby50cyc6ICdleHBvcnQgdmFyIG1lYW5pbmcgPSA4NDsnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9tZWFuaW5nXFxzKj1cXHMqODQvKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250ZW50KS5ub3QudG9NYXRjaCgvbWVhbmluZ1xccyo9XFxzKjQyLyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0YWtlKDIpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbigoKSA9PiBkb25lKCksIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG59KTtcbiJdfQ==