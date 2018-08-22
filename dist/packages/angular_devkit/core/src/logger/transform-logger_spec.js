"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-any
const operators_1 = require("rxjs/operators");
const transform_logger_1 = require("./transform-logger");
describe('TransformLogger', () => {
    it('works', (done) => {
        const logger = new transform_logger_1.TransformLogger('test', stream => {
            return stream.pipe(operators_1.filter(entry => entry.message != 'hello'), operators_1.map(entry => (entry.message += '1', entry)));
        });
        logger.pipe(operators_1.toArray())
            .toPromise()
            .then((observed) => {
            expect(observed).toEqual([
                jasmine.objectContaining({ message: 'world1', level: 'info', name: 'test' }),
            ]);
        })
            .then(() => done(), err => done.fail(err));
        logger.debug('hello');
        logger.info('world');
        logger.complete();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLWxvZ2dlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy9sb2dnZXIvdHJhbnNmb3JtLWxvZ2dlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0JBQXdCO0FBQ3hCLDhDQUFzRDtBQUV0RCx5REFBcUQ7QUFHckQsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNsRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLGtCQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxFQUN6QyxlQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQU8sRUFBRSxDQUFDO2FBQ25CLFNBQVMsRUFBRTthQUNYLElBQUksQ0FBQyxDQUFDLFFBQW9CLEVBQUUsRUFBRTtZQUM3QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN2QixPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFRO2FBQ3BGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUU3QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnlcbmltcG9ydCB7IGZpbHRlciwgbWFwLCB0b0FycmF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTG9nRW50cnkgfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyBUcmFuc2Zvcm1Mb2dnZXIgfSBmcm9tICcuL3RyYW5zZm9ybS1sb2dnZXInO1xuXG5cbmRlc2NyaWJlKCdUcmFuc2Zvcm1Mb2dnZXInLCAoKSA9PiB7XG4gIGl0KCd3b3JrcycsIChkb25lOiBEb25lRm4pID0+IHtcbiAgICBjb25zdCBsb2dnZXIgPSBuZXcgVHJhbnNmb3JtTG9nZ2VyKCd0ZXN0Jywgc3RyZWFtID0+IHtcbiAgICAgIHJldHVybiBzdHJlYW0ucGlwZShcbiAgICAgICAgZmlsdGVyKGVudHJ5ID0+IGVudHJ5Lm1lc3NhZ2UgIT0gJ2hlbGxvJyksXG4gICAgICAgIG1hcChlbnRyeSA9PiAoZW50cnkubWVzc2FnZSArPSAnMScsIGVudHJ5KSkpO1xuICAgIH0pO1xuICAgIGxvZ2dlci5waXBlKHRvQXJyYXkoKSlcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oKG9ic2VydmVkOiBMb2dFbnRyeVtdKSA9PiB7XG4gICAgICAgIGV4cGVjdChvYnNlcnZlZCkudG9FcXVhbChbXG4gICAgICAgICAgamFzbWluZS5vYmplY3RDb250YWluaW5nKHsgbWVzc2FnZTogJ3dvcmxkMScsIGxldmVsOiAnaW5mbycsIG5hbWU6ICd0ZXN0JyB9KSBhcyBhbnksXG4gICAgICAgIF0pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKCgpID0+IGRvbmUoKSwgZXJyID0+IGRvbmUuZmFpbChlcnIpKTtcblxuICAgIGxvZ2dlci5kZWJ1ZygnaGVsbG8nKTtcbiAgICBsb2dnZXIuaW5mbygnd29ybGQnKTtcbiAgICBsb2dnZXIuY29tcGxldGUoKTtcbiAgfSk7XG59KTtcbiJdfQ==