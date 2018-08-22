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
describe('Karma Builder code coverage', () => {
    const coverageFilePath = core_1.normalize('coverage/lcov.info');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        const overrides = { codeCoverage: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.karmaTargetSpec, overrides).pipe(
        // It seems like the coverage files take a while being written to disk, so we wait 500ms here.
        operators_1.debounceTime(500), operators_1.tap(buildEvent => {
            expect(buildEvent.success).toBe(true);
            expect(utils_1.host.scopedSync().exists(coverageFilePath)).toBe(true);
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(coverageFilePath));
            expect(content).toContain('polyfills.ts');
            expect(content).toContain('test.ts');
        })).toPromise().then(done, done.fail);
    }, 120000);
    it('supports exclude', (done) => {
        const overrides = {
            codeCoverage: true,
            codeCoverageExclude: [
                'src/polyfills.ts',
                '**/test.ts',
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.karmaTargetSpec, overrides).pipe(
        // It seems like the coverage files take a while being written to disk, so we wait 500ms here.
        operators_1.debounceTime(500), operators_1.tap(buildEvent => {
            expect(buildEvent.success).toBe(true);
            expect(utils_1.host.scopedSync().exists(coverageFilePath)).toBe(true);
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(coverageFilePath));
            expect(content).not.toContain('polyfills.ts');
            expect(content).not.toContain('test.ts');
        })).toPromise().then(done, done.fail);
    }, 120000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1jb3ZlcmFnZV9zcGVjX2xhcmdlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9hbmd1bGFyL3Rlc3Qva2FybWEvY29kZS1jb3ZlcmFnZV9zcGVjX2xhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0RBQWtFO0FBQ2xFLCtDQUE0RDtBQUM1RCw4Q0FBbUQ7QUFFbkQsb0NBQWlEO0FBR2pELFFBQVEsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7SUFDM0MsTUFBTSxnQkFBZ0IsR0FBRyxnQkFBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFFekQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLE1BQU0sU0FBUyxHQUEwQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUVoRix1QkFBYSxDQUFDLFlBQUksRUFBRSx1QkFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUk7UUFDbEQsOEZBQThGO1FBQzlGLHdCQUFZLENBQUMsR0FBRyxDQUFDLEVBQ2pCLGVBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNmLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUQsTUFBTSxPQUFPLEdBQUcsZ0JBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN2RixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFWCxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM5QixNQUFNLFNBQVMsR0FBMEM7WUFDdkQsWUFBWSxFQUFFLElBQUk7WUFDbEIsbUJBQW1CLEVBQUU7Z0JBQ25CLGtCQUFrQjtnQkFDbEIsWUFBWTthQUNiO1NBQ0YsQ0FBQztRQUVGLHVCQUFhLENBQUMsWUFBSSxFQUFFLHVCQUFlLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSTtRQUNsRCw4RkFBOEY7UUFDOUYsd0JBQVksQ0FBQyxHQUFHLENBQUMsRUFDakIsZUFBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5RCxNQUFNLE9BQU8sR0FBRyxnQkFBUyxDQUFDLGtCQUFrQixDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3ZGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUNILENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE5vcm1hbGl6ZWRLYXJtYUJ1aWxkZXJTY2hlbWEgfSBmcm9tICcuLi8uLi9zcmMnO1xuaW1wb3J0IHsgaG9zdCwga2FybWFUYXJnZXRTcGVjIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5cbmRlc2NyaWJlKCdLYXJtYSBCdWlsZGVyIGNvZGUgY292ZXJhZ2UnLCAoKSA9PiB7XG4gIGNvbnN0IGNvdmVyYWdlRmlsZVBhdGggPSBub3JtYWxpemUoJ2NvdmVyYWdlL2xjb3YuaW5mbycpO1xuXG4gIGJlZm9yZUVhY2goZG9uZSA9PiBob3N0LmluaXRpYWxpemUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuICBhZnRlckVhY2goZG9uZSA9PiBob3N0LnJlc3RvcmUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuXG4gIGl0KCd3b3JrcycsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzOiBQYXJ0aWFsPE5vcm1hbGl6ZWRLYXJtYUJ1aWxkZXJTY2hlbWE+ID0geyBjb2RlQ292ZXJhZ2U6IHRydWUgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwga2FybWFUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICAvLyBJdCBzZWVtcyBsaWtlIHRoZSBjb3ZlcmFnZSBmaWxlcyB0YWtlIGEgd2hpbGUgYmVpbmcgd3JpdHRlbiB0byBkaXNrLCBzbyB3ZSB3YWl0IDUwMG1zIGhlcmUuXG4gICAgICBkZWJvdW5jZVRpbWUoNTAwKSxcbiAgICAgIHRhcChidWlsZEV2ZW50ID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhjb3ZlcmFnZUZpbGVQYXRoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChjb3ZlcmFnZUZpbGVQYXRoKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b0NvbnRhaW4oJ3BvbHlmaWxscy50cycpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9Db250YWluKCd0ZXN0LnRzJyk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSwgMTIwMDAwKTtcblxuICBpdCgnc3VwcG9ydHMgZXhjbHVkZScsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzOiBQYXJ0aWFsPE5vcm1hbGl6ZWRLYXJtYUJ1aWxkZXJTY2hlbWE+ID0ge1xuICAgICAgY29kZUNvdmVyYWdlOiB0cnVlLFxuICAgICAgY29kZUNvdmVyYWdlRXhjbHVkZTogW1xuICAgICAgICAnc3JjL3BvbHlmaWxscy50cycsXG4gICAgICAgICcqKi90ZXN0LnRzJyxcbiAgICAgIF0sXG4gICAgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwga2FybWFUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICAvLyBJdCBzZWVtcyBsaWtlIHRoZSBjb3ZlcmFnZSBmaWxlcyB0YWtlIGEgd2hpbGUgYmVpbmcgd3JpdHRlbiB0byBkaXNrLCBzbyB3ZSB3YWl0IDUwMG1zIGhlcmUuXG4gICAgICBkZWJvdW5jZVRpbWUoNTAwKSxcbiAgICAgIHRhcChidWlsZEV2ZW50ID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhjb3ZlcmFnZUZpbGVQYXRoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChjb3ZlcmFnZUZpbGVQYXRoKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS5ub3QudG9Db250YWluKCdwb2x5ZmlsbHMudHMnKTtcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLm5vdC50b0NvbnRhaW4oJ3Rlc3QudHMnKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCAxMjAwMDApO1xufSk7XG4iXX0=