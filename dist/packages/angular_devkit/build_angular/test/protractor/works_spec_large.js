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
describe('Protractor Builder', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        testing_1.runTargetSpec(utils_1.host, utils_1.protractorTargetSpec).pipe(operators_1.retry(3)).toPromise().then(done, done.fail);
    }, 30000);
    it('works with no devServerTarget', (done) => {
        const overrides = { devServerTarget: undefined };
        testing_1.runTargetSpec(utils_1.host, utils_1.protractorTargetSpec, overrides).pipe(
        // This should fail because no server is available for connection.
        ).subscribe(undefined, () => done(), done.fail);
    }, 30000);
    it('overrides protractor specs', (done) => {
        utils_1.host.scopedSync().rename(core_1.normalize('./e2e/app.e2e-spec.ts'), core_1.normalize('./e2e/renamed-app.e2e-spec.ts'));
        const overrides = { specs: ['./e2e/renamed-app.e2e-spec.ts'] };
        testing_1.runTargetSpec(utils_1.host, utils_1.protractorTargetSpec, overrides).pipe(operators_1.retry(3)).toPromise().then(done, done.fail);
    }, 60000);
    it('overrides protractor suites', (done) => {
        utils_1.host.scopedSync().rename(core_1.normalize('./e2e/app.e2e-spec.ts'), core_1.normalize('./e2e/renamed-app.e2e-spec.ts'));
        // Suites block need to be added in the protractor.conf.js file to test suites
        utils_1.host.replaceInFile('protractor.conf.js', `allScriptsTimeout: 11000,`, `
      allScriptsTimeout: 11000,
      suites: {
        app: './e2e/app.e2e-spec.ts'
      },
    `);
        const overrides = { suite: 'app' };
        testing_1.runTargetSpec(utils_1.host, utils_1.protractorTargetSpec, overrides).pipe(operators_1.retry(3)).toPromise().then(done, done.fail);
    }, 60000);
    // TODO: test `element-explorer` when the protractor builder emits build events with text.
    // .then(() => execAndWaitForOutputToMatch('ng', ['e2e', '--element-explorer'],
    // /Element Explorer/))
    // .then(() => killAllProcesses(), (err: any) => {
    //   killAllProcesses();
    //   throw err;
    // })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya3Nfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L3Byb3RyYWN0b3Ivd29ya3Nfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSwrQ0FBaUQ7QUFDakQsOENBQXVDO0FBQ3ZDLG9DQUFzRDtBQUd0RCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNuQix1QkFBYSxDQUFDLFlBQUksRUFBRSw0QkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FDNUMsaUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FDVCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVWLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzNDLE1BQU0sU0FBUyxHQUFHLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBRWpELHVCQUFhLENBQUMsWUFBSSxFQUFFLDRCQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUk7UUFDdkQsa0VBQWtFO1NBQ25FLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRVYsRUFBRSxDQUFDLDRCQUE0QixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDeEMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLHVCQUF1QixDQUFDLEVBQ3pELGdCQUFTLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDO1FBRTlDLE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsK0JBQStCLENBQUMsRUFBRSxDQUFDO1FBRS9ELHVCQUFhLENBQUMsWUFBSSxFQUFFLDRCQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FDdkQsaUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FDVCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVWLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3pDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUN6RCxnQkFBUyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQztRQUU5Qyw4RUFBOEU7UUFDOUUsWUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSwyQkFBMkIsRUFBRTs7Ozs7S0FLckUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFFbkMsdUJBQWEsQ0FBQyxZQUFJLEVBQUUsNEJBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUN2RCxpQkFBSyxDQUFDLENBQUMsQ0FBQyxDQUNULENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRVYsMEZBQTBGO0lBQzFGLCtFQUErRTtJQUMvRSx1QkFBdUI7SUFDdkIsa0RBQWtEO0lBQ2xELHdCQUF3QjtJQUN4QixlQUFlO0lBQ2YsS0FBSztBQUNQLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaG9zdCwgcHJvdHJhY3RvclRhcmdldFNwZWMgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZGVzY3JpYmUoJ1Byb3RyYWN0b3IgQnVpbGRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaChkb25lID0+IGhvc3QuaW5pdGlhbGl6ZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG4gIGFmdGVyRWFjaChkb25lID0+IGhvc3QucmVzdG9yZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cbiAgaXQoJ3dvcmtzJywgKGRvbmUpID0+IHtcbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIHByb3RyYWN0b3JUYXJnZXRTcGVjKS5waXBlKFxuICAgICAgcmV0cnkoMyksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDMwMDAwKTtcblxuICBpdCgnd29ya3Mgd2l0aCBubyBkZXZTZXJ2ZXJUYXJnZXQnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgZGV2U2VydmVyVGFyZ2V0OiB1bmRlZmluZWQgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgcHJvdHJhY3RvclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGZhaWwgYmVjYXVzZSBubyBzZXJ2ZXIgaXMgYXZhaWxhYmxlIGZvciBjb25uZWN0aW9uLlxuICAgICkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgKCkgPT4gZG9uZSgpLCBkb25lLmZhaWwpO1xuICB9LCAzMDAwMCk7XG5cbiAgaXQoJ292ZXJyaWRlcyBwcm90cmFjdG9yIHNwZWNzJywgKGRvbmUpID0+IHtcbiAgICBob3N0LnNjb3BlZFN5bmMoKS5yZW5hbWUobm9ybWFsaXplKCcuL2UyZS9hcHAuZTJlLXNwZWMudHMnKSxcbiAgICAgIG5vcm1hbGl6ZSgnLi9lMmUvcmVuYW1lZC1hcHAuZTJlLXNwZWMudHMnKSk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IHNwZWNzOiBbJy4vZTJlL3JlbmFtZWQtYXBwLmUyZS1zcGVjLnRzJ10gfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgcHJvdHJhY3RvclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHJldHJ5KDMpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA2MDAwMCk7XG5cbiAgaXQoJ292ZXJyaWRlcyBwcm90cmFjdG9yIHN1aXRlcycsIChkb25lKSA9PiB7XG4gICAgaG9zdC5zY29wZWRTeW5jKCkucmVuYW1lKG5vcm1hbGl6ZSgnLi9lMmUvYXBwLmUyZS1zcGVjLnRzJyksXG4gICAgICBub3JtYWxpemUoJy4vZTJlL3JlbmFtZWQtYXBwLmUyZS1zcGVjLnRzJykpO1xuXG4gICAgLy8gU3VpdGVzIGJsb2NrIG5lZWQgdG8gYmUgYWRkZWQgaW4gdGhlIHByb3RyYWN0b3IuY29uZi5qcyBmaWxlIHRvIHRlc3Qgc3VpdGVzXG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdwcm90cmFjdG9yLmNvbmYuanMnLCBgYWxsU2NyaXB0c1RpbWVvdXQ6IDExMDAwLGAsIGBcbiAgICAgIGFsbFNjcmlwdHNUaW1lb3V0OiAxMTAwMCxcbiAgICAgIHN1aXRlczoge1xuICAgICAgICBhcHA6ICcuL2UyZS9hcHAuZTJlLXNwZWMudHMnXG4gICAgICB9LFxuICAgIGApO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0geyBzdWl0ZTogJ2FwcCcgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgcHJvdHJhY3RvclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHJldHJ5KDMpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA2MDAwMCk7XG5cbiAgLy8gVE9ETzogdGVzdCBgZWxlbWVudC1leHBsb3JlcmAgd2hlbiB0aGUgcHJvdHJhY3RvciBidWlsZGVyIGVtaXRzIGJ1aWxkIGV2ZW50cyB3aXRoIHRleHQuXG4gIC8vIC50aGVuKCgpID0+IGV4ZWNBbmRXYWl0Rm9yT3V0cHV0VG9NYXRjaCgnbmcnLCBbJ2UyZScsICctLWVsZW1lbnQtZXhwbG9yZXInXSxcbiAgLy8gL0VsZW1lbnQgRXhwbG9yZXIvKSlcbiAgLy8gLnRoZW4oKCkgPT4ga2lsbEFsbFByb2Nlc3NlcygpLCAoZXJyOiBhbnkpID0+IHtcbiAgLy8gICBraWxsQWxsUHJvY2Vzc2VzKCk7XG4gIC8vICAgdGhyb3cgZXJyO1xuICAvLyB9KVxufSk7XG4iXX0=