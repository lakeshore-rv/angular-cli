"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core"); // tslint:disable-line:no-implicit-dependencies
const ast_helpers_1 = require("./ast_helpers");
const export_ngfactory_1 = require("./export_ngfactory");
describe('@ngtools/webpack transformers', () => {
    describe('export_ngfactory', () => {
        it('should export the ngfactory', () => {
            const input = core_1.tags.stripIndent `
        export { AppModule } from './app/app.module';
      `;
            const output = core_1.tags.stripIndent `
        export { AppModuleNgFactory } from "./app/app.module.ngfactory";
        export { AppModule } from './app/app.module';
      `;
            const transformer = export_ngfactory_1.exportNgFactory(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]));
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should export the ngfactory when there is a barrel file', () => {
            const input = core_1.tags.stripIndent `
        export { AppModule } from './app';
      `;
            const output = core_1.tags.stripIndent `
        export { AppModuleNgFactory } from "./app/app.module.ngfactory";
        export { AppModule } from './app';
      `;
            const transformer = export_ngfactory_1.exportNgFactory(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]));
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should not do anything if shouldTransform returns false', () => {
            const input = core_1.tags.stripIndent `
        export { AppModule } from './app/app.module';
      `;
            const transformer = export_ngfactory_1.exportNgFactory(() => false, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]));
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${input}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0X25nZmFjdG9yeV9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9uZ3Rvb2xzL3dlYnBhY2svc3JjL3RyYW5zZm9ybWVycy9leHBvcnRfbmdmYWN0b3J5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBNEMsQ0FBRSwrQ0FBK0M7QUFDN0YsK0NBQW9EO0FBQ3BELHlEQUFxRDtBQUVyRCxRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQzdDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUNyQyxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztPQUU3QixDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7O09BRzlCLENBQUM7WUFFRixNQUFNLFdBQVcsR0FBRyxrQ0FBZSxDQUNqQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQzFFLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxpQ0FBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1lBQ2pFLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7O09BRTdCLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7T0FHOUIsQ0FBQztZQUVGLE1BQU0sV0FBVyxHQUFHLGtDQUFlLENBQ2pDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsNkJBQTZCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FDMUUsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHLGlDQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7WUFDakUsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7T0FFN0IsQ0FBQztZQUVGLE1BQU0sV0FBVyxHQUFHLGtDQUFlLENBQ2pDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFDWCxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsNkJBQTZCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FDMUUsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHLGlDQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyB0YWdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnOyAgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IHRyYW5zZm9ybVR5cGVzY3JpcHQgfSBmcm9tICcuL2FzdF9oZWxwZXJzJztcbmltcG9ydCB7IGV4cG9ydE5nRmFjdG9yeSB9IGZyb20gJy4vZXhwb3J0X25nZmFjdG9yeSc7XG5cbmRlc2NyaWJlKCdAbmd0b29scy93ZWJwYWNrIHRyYW5zZm9ybWVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2V4cG9ydF9uZ2ZhY3RvcnknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHBvcnQgdGhlIG5nZmFjdG9yeScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgZXhwb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAvYXBwLm1vZHVsZSc7XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgZXhwb3J0IHsgQXBwTW9kdWxlTmdGYWN0b3J5IH0gZnJvbSBcIi4vYXBwL2FwcC5tb2R1bGUubmdmYWN0b3J5XCI7XG4gICAgICAgIGV4cG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gJy4vYXBwL2FwcC5tb2R1bGUnO1xuICAgICAgYDtcblxuICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBleHBvcnROZ0ZhY3RvcnkoXG4gICAgICAgICgpID0+IHRydWUsXG4gICAgICAgICgpID0+IChbeyBwYXRoOiAnL3Byb2plY3Qvc3JjL2FwcC9hcHAubW9kdWxlJywgY2xhc3NOYW1lOiAnQXBwTW9kdWxlJyB9XSksXG4gICAgICApO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtVHlwZXNjcmlwdChpbnB1dCwgW3RyYW5zZm9ybWVyXSk7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtyZXN1bHR9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4cG9ydCB0aGUgbmdmYWN0b3J5IHdoZW4gdGhlcmUgaXMgYSBiYXJyZWwgZmlsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgZXhwb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAnO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGV4cG9ydCB7IEFwcE1vZHVsZU5nRmFjdG9yeSB9IGZyb20gXCIuL2FwcC9hcHAubW9kdWxlLm5nZmFjdG9yeVwiO1xuICAgICAgICBleHBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcCc7XG4gICAgICBgO1xuXG4gICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGV4cG9ydE5nRmFjdG9yeShcbiAgICAgICAgKCkgPT4gdHJ1ZSxcbiAgICAgICAgKCkgPT4gKFt7IHBhdGg6ICcvcHJvamVjdC9zcmMvYXBwL2FwcC5tb2R1bGUnLCBjbGFzc05hbWU6ICdBcHBNb2R1bGUnIH1dKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KGlucHV0LCBbdHJhbnNmb3JtZXJdKTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGRvIGFueXRoaW5nIGlmIHNob3VsZFRyYW5zZm9ybSByZXR1cm5zIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBleHBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gZXhwb3J0TmdGYWN0b3J5KFxuICAgICAgICAoKSA9PiBmYWxzZSxcbiAgICAgICAgKCkgPT4gKFt7IHBhdGg6ICcvcHJvamVjdC9zcmMvYXBwL2FwcC5tb2R1bGUnLCBjbGFzc05hbWU6ICdBcHBNb2R1bGUnIH1dKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KGlucHV0LCBbdHJhbnNmb3JtZXJdKTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke2lucHV0fWApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19