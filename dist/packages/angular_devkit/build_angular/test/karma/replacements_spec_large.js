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
describe('Karma Builder file replacements', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('allows file replacements', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/meaning-too.ts': 'export var meaning = 42;',
            'src/meaning.ts': `export var meaning = 10;`,
            'src/test.ts': `
        import { meaning } from './meaning';

        describe('Test file replacement', () => {
          it('should replace file', () => {
            expect(meaning).toBe(42);
          });
        });
      `,
        });
        const overrides = {
            fileReplacements: [{
                    replace: core_1.normalize('/src/meaning.ts'),
                    with: core_1.normalize('/src/meaning-too.ts'),
                }],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.karmaTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    }, 30000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZW1lbnRzX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9rYXJtYS9yZXBsYWNlbWVudHNfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSwrQ0FBaUQ7QUFDakQsOENBQXFDO0FBQ3JDLG9DQUFpRDtBQUdqRCxRQUFRLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO0lBQy9DLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3RDLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUN0QixvQkFBb0IsRUFBRSwwQkFBMEI7WUFDaEQsZ0JBQWdCLEVBQUUsMEJBQTBCO1lBRTVDLGFBQWEsRUFBRTs7Ozs7Ozs7T0FRZDtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHO1lBQ2hCLGdCQUFnQixFQUFFLENBQUM7b0JBQ2pCLE9BQU8sRUFBRSxnQkFBUyxDQUFDLGlCQUFpQixDQUFDO29CQUNyQyxJQUFJLEVBQUUsZ0JBQVMsQ0FBQyxxQkFBcUIsQ0FBQztpQkFDdkMsQ0FBQztTQUNILENBQUM7UUFFRix1QkFBYSxDQUFDLFlBQUksRUFBRSx1QkFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FDbEQsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMzRCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNaLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGhvc3QsIGthcm1hVGFyZ2V0U3BlYyB9IGZyb20gJy4uL3V0aWxzJztcblxuXG5kZXNjcmliZSgnS2FybWEgQnVpbGRlciBmaWxlIHJlcGxhY2VtZW50cycsICgpID0+IHtcbiAgYmVmb3JlRWFjaChkb25lID0+IGhvc3QuaW5pdGlhbGl6ZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG4gIGFmdGVyRWFjaChkb25lID0+IGhvc3QucmVzdG9yZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cbiAgaXQoJ2FsbG93cyBmaWxlIHJlcGxhY2VtZW50cycsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9tZWFuaW5nLXRvby50cyc6ICdleHBvcnQgdmFyIG1lYW5pbmcgPSA0MjsnLFxuICAgICAgJ3NyYy9tZWFuaW5nLnRzJzogYGV4cG9ydCB2YXIgbWVhbmluZyA9IDEwO2AsXG5cbiAgICAgICdzcmMvdGVzdC50cyc6IGBcbiAgICAgICAgaW1wb3J0IHsgbWVhbmluZyB9IGZyb20gJy4vbWVhbmluZyc7XG5cbiAgICAgICAgZGVzY3JpYmUoJ1Rlc3QgZmlsZSByZXBsYWNlbWVudCcsICgpID0+IHtcbiAgICAgICAgICBpdCgnc2hvdWxkIHJlcGxhY2UgZmlsZScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChtZWFuaW5nKS50b0JlKDQyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICBgLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgZmlsZVJlcGxhY2VtZW50czogW3tcbiAgICAgICAgcmVwbGFjZTogbm9ybWFsaXplKCcvc3JjL21lYW5pbmcudHMnKSxcbiAgICAgICAgd2l0aDogbm9ybWFsaXplKCcvc3JjL21lYW5pbmctdG9vLnRzJyksXG4gICAgICB9XSxcbiAgICB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBrYXJtYVRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDMwMDAwKTtcbn0pO1xuIl19