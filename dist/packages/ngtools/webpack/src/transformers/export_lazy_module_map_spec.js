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
const export_lazy_module_map_1 = require("./export_lazy_module_map");
describe('@ngtools/webpack transformers', () => {
    describe('export_lazy_module_map', () => {
        it('should create module map for JIT', () => {
            const input = core_1.tags.stripIndent `
        export { AppModule } from './app/app.module';
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.stripIndent `
        import * as __lazy_0__ from "./app/lazy/lazy.module.ts";
        import * as __lazy_1__ from "./app/lazy2/lazy2.module.ts";
        export { AppModule } from './app/app.module';
        export var LAZY_MODULE_MAP = { "./lazy/lazy.module#LazyModule": __lazy_0__.LazyModule, "./lazy2/lazy2.module#LazyModule2": __lazy_1__.LazyModule2 };
      `;
            // tslint:enable:max-line-length
            const transformer = export_lazy_module_map_1.exportLazyModuleMap(() => true, () => ({
                './lazy/lazy.module#LazyModule': '/project/src/app/lazy/lazy.module.ts',
                './lazy2/lazy2.module#LazyModule2': '/project/src/app/lazy2/lazy2.module.ts',
            }));
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should create module map for AOT', () => {
            const input = core_1.tags.stripIndent `
      export { AppModule } from './app/app.module';
    `;
            // tslint:disable:max-line-length
            const expected = core_1.tags.stripIndent `
      import * as __lazy_0__ from "./app/lazy/lazy.module.ngfactory.ts";
      import * as __lazy_1__ from "./app/lazy2/lazy2.module.ngfactory.ts";
      export { AppModule } from './app/app.module';
      export var LAZY_MODULE_MAP = { "./lazy/lazy.module#LazyModule": __lazy_0__.LazyModuleNgFactory, "./lazy2/lazy2.module#LazyModule2": __lazy_1__.LazyModule2NgFactory };
    `;
            // tslint:enable:max-line-length
            const transformer = export_lazy_module_map_1.exportLazyModuleMap(() => true, () => ({
                './lazy/lazy.module.ngfactory#LazyModuleNgFactory': '/project/src/app/lazy/lazy.module.ngfactory.ts',
                './lazy2/lazy2.module.ngfactory#LazyModule2NgFactory': '/project/src/app/lazy2/lazy2.module.ngfactory.ts',
            }));
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${expected}`);
        });
    });
    it('should not do anything if shouldTransform returns false', () => {
        const input = core_1.tags.stripIndent `
        export { AppModule } from './app/app.module';
      `;
        const transformer = export_lazy_module_map_1.exportLazyModuleMap(() => false, () => ({
            './lazy/lazy.module#LazyModule': '/project/src/app/lazy/lazy.module.ts',
            './lazy2/lazy2.module#LazyModule2': '/project/src/app/lazy2/lazy2.module.ts',
        }));
        const result = ast_helpers_1.transformTypescript(input, [transformer]);
        expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${input}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0X2xhenlfbW9kdWxlX21hcF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9uZ3Rvb2xzL3dlYnBhY2svc3JjL3RyYW5zZm9ybWVycy9leHBvcnRfbGF6eV9tb2R1bGVfbWFwX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBNEMsQ0FBRSwrQ0FBK0M7QUFDN0YsK0NBQW9EO0FBQ3BELHFFQUErRDtBQUUvRCxRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQzdDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDdEMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUMxQyxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztPQUU3QixDQUFDO1lBQ0YsaUNBQWlDO1lBQ2pDLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7O09BSzlCLENBQUM7WUFDRixnQ0FBZ0M7WUFFaEMsTUFBTSxXQUFXLEdBQUcsNENBQW1CLENBQ3JDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFDVixHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNMLCtCQUErQixFQUFFLHNDQUFzQztnQkFDdkUsa0NBQWtDLEVBQUUsd0NBQXdDO2FBQzdFLENBQUMsQ0FDSCxDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsaUNBQW1CLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUV6RCxNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUMxQyxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztLQUUvQixDQUFDO1lBQ0EsaUNBQWlDO1lBQ2pDLE1BQU0sUUFBUSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7O0tBS2xDLENBQUM7WUFDQSxnQ0FBZ0M7WUFFaEMsTUFBTSxXQUFXLEdBQUcsNENBQW1CLENBQ3JDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFDVixHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNMLGtEQUFrRCxFQUNsRCxnREFBZ0Q7Z0JBQ2hELHFEQUFxRCxFQUNyRCxrREFBa0Q7YUFDbkQsQ0FBQyxDQUNILENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxpQ0FBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7T0FFM0IsQ0FBQztRQUVKLE1BQU0sV0FBVyxHQUFHLDRDQUFtQixDQUNyQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQ1gsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNMLCtCQUErQixFQUFFLHNDQUFzQztZQUN2RSxrQ0FBa0MsRUFBRSx3Q0FBd0M7U0FDN0UsQ0FBQyxDQUNILENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxpQ0FBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRXpELE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7ICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgdHJhbnNmb3JtVHlwZXNjcmlwdCB9IGZyb20gJy4vYXN0X2hlbHBlcnMnO1xuaW1wb3J0IHsgZXhwb3J0TGF6eU1vZHVsZU1hcCB9IGZyb20gJy4vZXhwb3J0X2xhenlfbW9kdWxlX21hcCc7XG5cbmRlc2NyaWJlKCdAbmd0b29scy93ZWJwYWNrIHRyYW5zZm9ybWVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2V4cG9ydF9sYXp5X21vZHVsZV9tYXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgbW9kdWxlIG1hcCBmb3IgSklUJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBleHBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgIGA7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCAqIGFzIF9fbGF6eV8wX18gZnJvbSBcIi4vYXBwL2xhenkvbGF6eS5tb2R1bGUudHNcIjtcbiAgICAgICAgaW1wb3J0ICogYXMgX19sYXp5XzFfXyBmcm9tIFwiLi9hcHAvbGF6eTIvbGF6eTIubW9kdWxlLnRzXCI7XG4gICAgICAgIGV4cG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gJy4vYXBwL2FwcC5tb2R1bGUnO1xuICAgICAgICBleHBvcnQgdmFyIExBWllfTU9EVUxFX01BUCA9IHsgXCIuL2xhenkvbGF6eS5tb2R1bGUjTGF6eU1vZHVsZVwiOiBfX2xhenlfMF9fLkxhenlNb2R1bGUsIFwiLi9sYXp5Mi9sYXp5Mi5tb2R1bGUjTGF6eU1vZHVsZTJcIjogX19sYXp5XzFfXy5MYXp5TW9kdWxlMiB9O1xuICAgICAgYDtcbiAgICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gZXhwb3J0TGF6eU1vZHVsZU1hcChcbiAgICAgICAgKCkgPT4gdHJ1ZSxcbiAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICAnLi9sYXp5L2xhenkubW9kdWxlI0xhenlNb2R1bGUnOiAnL3Byb2plY3Qvc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlLnRzJyxcbiAgICAgICAgICAnLi9sYXp5Mi9sYXp5Mi5tb2R1bGUjTGF6eU1vZHVsZTInOiAnL3Byb2plY3Qvc3JjL2FwcC9sYXp5Mi9sYXp5Mi5tb2R1bGUudHMnLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KGlucHV0LCBbdHJhbnNmb3JtZXJdKTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIG1vZHVsZSBtYXAgZm9yIEFPVCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGV4cG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gJy4vYXBwL2FwcC5tb2R1bGUnO1xuICAgIGA7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGltcG9ydCAqIGFzIF9fbGF6eV8wX18gZnJvbSBcIi4vYXBwL2xhenkvbGF6eS5tb2R1bGUubmdmYWN0b3J5LnRzXCI7XG4gICAgICBpbXBvcnQgKiBhcyBfX2xhenlfMV9fIGZyb20gXCIuL2FwcC9sYXp5Mi9sYXp5Mi5tb2R1bGUubmdmYWN0b3J5LnRzXCI7XG4gICAgICBleHBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgIGV4cG9ydCB2YXIgTEFaWV9NT0RVTEVfTUFQID0geyBcIi4vbGF6eS9sYXp5Lm1vZHVsZSNMYXp5TW9kdWxlXCI6IF9fbGF6eV8wX18uTGF6eU1vZHVsZU5nRmFjdG9yeSwgXCIuL2xhenkyL2xhenkyLm1vZHVsZSNMYXp5TW9kdWxlMlwiOiBfX2xhenlfMV9fLkxhenlNb2R1bGUyTmdGYWN0b3J5IH07XG4gICAgYDtcbiAgICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gZXhwb3J0TGF6eU1vZHVsZU1hcChcbiAgICAgICAgKCkgPT4gdHJ1ZSxcbiAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICAnLi9sYXp5L2xhenkubW9kdWxlLm5nZmFjdG9yeSNMYXp5TW9kdWxlTmdGYWN0b3J5JzpcbiAgICAgICAgICAnL3Byb2plY3Qvc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlLm5nZmFjdG9yeS50cycsXG4gICAgICAgICAgJy4vbGF6eTIvbGF6eTIubW9kdWxlLm5nZmFjdG9yeSNMYXp5TW9kdWxlMk5nRmFjdG9yeSc6XG4gICAgICAgICAgJy9wcm9qZWN0L3NyYy9hcHAvbGF6eTIvbGF6eTIubW9kdWxlLm5nZmFjdG9yeS50cycsXG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQoaW5wdXQsIFt0cmFuc2Zvcm1lcl0pO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7ZXhwZWN0ZWR9YCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IGRvIGFueXRoaW5nIGlmIHNob3VsZFRyYW5zZm9ybSByZXR1cm5zIGZhbHNlJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgZXhwb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAvYXBwLm1vZHVsZSc7XG4gICAgICBgO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtZXIgPSBleHBvcnRMYXp5TW9kdWxlTWFwKFxuICAgICAgKCkgPT4gZmFsc2UsXG4gICAgICAoKSA9PiAoe1xuICAgICAgICAnLi9sYXp5L2xhenkubW9kdWxlI0xhenlNb2R1bGUnOiAnL3Byb2plY3Qvc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlLnRzJyxcbiAgICAgICAgJy4vbGF6eTIvbGF6eTIubW9kdWxlI0xhenlNb2R1bGUyJzogJy9wcm9qZWN0L3NyYy9hcHAvbGF6eTIvbGF6eTIubW9kdWxlLnRzJyxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtVHlwZXNjcmlwdChpbnB1dCwgW3RyYW5zZm9ybWVyXSk7XG5cbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7aW5wdXR9YCk7XG4gIH0pO1xufSk7XG4iXX0=