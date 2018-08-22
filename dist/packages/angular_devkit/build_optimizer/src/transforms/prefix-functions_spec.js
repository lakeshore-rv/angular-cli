"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable-next-line:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const transform_javascript_1 = require("../helpers/transform-javascript");
const prefix_functions_1 = require("./prefix-functions");
const transform = (content) => transform_javascript_1.transformJavascript({ content, getTransforms: [prefix_functions_1.getPrefixFunctionsTransformer] }).content;
describe('prefix-functions', () => {
    const emptyImportsComment = '/** PURE_IMPORTS_START  PURE_IMPORTS_END */';
    const clazz = 'var Clazz = (function () { function Clazz() { } return Clazz; }());';
    describe('pure imports', () => {
        it('adds import list', () => {
            const input = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        import { Something } from './relative/pure_import';
        var foo = Injectable;
        var bar = Something;
      `;
            const output = core_1.tags.stripIndent `
        /** PURE_IMPORTS_START _angular_core,_relative_pure_import PURE_IMPORTS_END */
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('adds import list even with no imports', () => {
            const input = core_1.tags.stripIndent `
        var foo = 42;
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
    describe('pure functions', () => {
        it('adds comment to new calls', () => {
            const input = core_1.tags.stripIndent `
        var newClazz = new Clazz();
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        var newClazz = /*@__PURE__*/ new Clazz();
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('adds comment to function calls', () => {
            const input = core_1.tags.stripIndent `
        var newClazz = Clazz();
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        var newClazz = /*@__PURE__*/ Clazz();
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('adds comment outside of IIFEs', () => {
            const input = core_1.tags.stripIndent `
        ${clazz}
        var ClazzTwo = (function () { function Clazz() { } return Clazz; })();
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        var Clazz = /*@__PURE__*/ (function () { function Clazz() { } return Clazz; }());
        var ClazzTwo = /*@__PURE__*/ (function () { function Clazz() { } return Clazz; })();
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t add comment when inside function declarations or expressions', () => {
            const input = core_1.tags.stripIndent `
        function funcDecl() {
          var newClazz = Clazz();
          var newClazzTwo = new Clazz();
        }

        var funcExpr = function () {
          var newClazz = Clazz();
          var newClazzTwo = new Clazz();
        };
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t add comment to downlevel namespaces', () => {
            const input = core_1.tags.stripIndent `
        function MyFunction() { }

        (function (MyFunction) {
            function subFunction() { }
            MyFunction.subFunction = subFunction;
        })(MyFunction || (MyFunctionn = {}));

        export { MyFunction };
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t add comment when inside class', () => {
            const input = core_1.tags.stripIndent `
        class Foo {
          constructor(e) {
            super(e);
          }
          method() {
            var newClazz = new Clazz();
          }
        }
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t add comment when inside arrow function', () => {
            const input = core_1.tags.stripIndent `
        export const subscribeToArray = (array) => (subscriber) => {
            for (let i = 0, len = array.length; i < len && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            if (!subscriber.closed) {
                subscriber.complete();
            }
        };
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t add comment when inside object literal method', () => {
            const input = core_1.tags.stripIndent `
        const literal = {
          method() {
            var newClazz = new Clazz();
          }
        };
      `;
            const output = core_1.tags.stripIndent `
        ${emptyImportsComment}
        ${input}
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWZ1bmN0aW9uc19zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0RBQW9EO0FBQ3BELCtDQUE0QztBQUM1QywwRUFBc0U7QUFDdEUseURBQW1FO0FBR25FLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQywwQ0FBbUIsQ0FDeEQsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsZ0RBQTZCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBRXZFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsTUFBTSxtQkFBbUIsR0FBRyw2Q0FBNkMsQ0FBQztJQUMxRSxNQUFNLEtBQUssR0FBRyxxRUFBcUUsQ0FBQztJQUVwRixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQzFCLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7O09BSzdCLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztVQUUzQixLQUFLO09BQ1IsQ0FBQztZQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9D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QixLQUFLO09BQ1IsQ0FBQztZQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgdGFncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IHRyYW5zZm9ybUphdmFzY3JpcHQgfSBmcm9tICcuLi9oZWxwZXJzL3RyYW5zZm9ybS1qYXZhc2NyaXB0JztcbmltcG9ydCB7IGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIH0gZnJvbSAnLi9wcmVmaXgtZnVuY3Rpb25zJztcblxuXG5jb25zdCB0cmFuc2Zvcm0gPSAoY29udGVudDogc3RyaW5nKSA9PiB0cmFuc2Zvcm1KYXZhc2NyaXB0KFxuICB7IGNvbnRlbnQsIGdldFRyYW5zZm9ybXM6IFtnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lcl0gfSkuY29udGVudDtcblxuZGVzY3JpYmUoJ3ByZWZpeC1mdW5jdGlvbnMnLCAoKSA9PiB7XG4gIGNvbnN0IGVtcHR5SW1wb3J0c0NvbW1lbnQgPSAnLyoqIFBVUkVfSU1QT1JUU19TVEFSVCAgUFVSRV9JTVBPUlRTX0VORCAqLyc7XG4gIGNvbnN0IGNsYXp6ID0gJ3ZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIENsYXp6KCkgeyB9IHJldHVybiBDbGF6ejsgfSgpKTsnO1xuXG4gIGRlc2NyaWJlKCdwdXJlIGltcG9ydHMnLCAoKSA9PiB7XG4gICAgaXQoJ2FkZHMgaW1wb3J0IGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgU29tZXRoaW5nIH0gZnJvbSAnLi9yZWxhdGl2ZS9wdXJlX2ltcG9ydCc7XG4gICAgICAgIHZhciBmb28gPSBJbmplY3RhYmxlO1xuICAgICAgICB2YXIgYmFyID0gU29tZXRoaW5nO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIC8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX2FuZ3VsYXJfY29yZSxfcmVsYXRpdmVfcHVyZV9pbXBvcnQgUFVSRV9JTVBPUlRTX0VORCAqL1xuICAgICAgICAke2lucHV0fVxuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnYWRkcyBpbXBvcnQgbGlzdCBldmVuIHdpdGggbm8gaW1wb3J0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgdmFyIGZvbyA9IDQyO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgICR7ZW1wdHlJbXBvcnRzQ29tbWVudH1cbiAgICAgICAgJHtpbnB1dH1cbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncHVyZSBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ2FkZHMgY29tbWVudCB0byBuZXcgY2FsbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIHZhciBuZXdDbGF6eiA9IG5ldyBDbGF6eigpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgICR7ZW1wdHlJbXBvcnRzQ29tbWVudH1cbiAgICAgICAgdmFyIG5ld0NsYXp6ID0gLypAX19QVVJFX18qLyBuZXcgQ2xhenooKTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgY29tbWVudCB0byBmdW5jdGlvbiBjYWxscycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgdmFyIG5ld0NsYXp6ID0gQ2xhenooKTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke2VtcHR5SW1wb3J0c0NvbW1lbnR9XG4gICAgICAgIHZhciBuZXdDbGF6eiA9IC8qQF9fUFVSRV9fKi8gQ2xhenooKTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgY29tbWVudCBvdXRzaWRlIG9mIElJRkVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke2NsYXp6fVxuICAgICAgICB2YXIgQ2xhenpUd28gPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBDbGF6eigpIHsgfSByZXR1cm4gQ2xheno7IH0pKCk7XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgJHtlbXB0eUltcG9ydHNDb21tZW50fVxuICAgICAgICB2YXIgQ2xhenogPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIENsYXp6KCkgeyB9IHJldHVybiBDbGF6ejsgfSgpKTtcbiAgICAgICAgdmFyIENsYXp6VHdvID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBDbGF6eigpIHsgfSByZXR1cm4gQ2xheno7IH0pKCk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzblxcJ3QgYWRkIGNvbW1lbnQgd2hlbiBpbnNpZGUgZnVuY3Rpb24gZGVjbGFyYXRpb25zIG9yIGV4cHJlc3Npb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBmdW5jdGlvbiBmdW5jRGVjbCgpIHtcbiAgICAgICAgICB2YXIgbmV3Q2xhenogPSBDbGF6eigpO1xuICAgICAgICAgIHZhciBuZXdDbGF6elR3byA9IG5ldyBDbGF6eigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZ1bmNFeHByID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBuZXdDbGF6eiA9IENsYXp6KCk7XG4gICAgICAgICAgdmFyIG5ld0NsYXp6VHdvID0gbmV3IENsYXp6KCk7XG4gICAgICAgIH07XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgJHtlbXB0eUltcG9ydHNDb21tZW50fVxuICAgICAgICAke2lucHV0fVxuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IGFkZCBjb21tZW50IHRvIGRvd25sZXZlbCBuYW1lc3BhY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBmdW5jdGlvbiBNeUZ1bmN0aW9uKCkgeyB9XG5cbiAgICAgICAgKGZ1bmN0aW9uIChNeUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBzdWJGdW5jdGlvbigpIHsgfVxuICAgICAgICAgICAgTXlGdW5jdGlvbi5zdWJGdW5jdGlvbiA9IHN1YkZ1bmN0aW9uO1xuICAgICAgICB9KShNeUZ1bmN0aW9uIHx8IChNeUZ1bmN0aW9ubiA9IHt9KSk7XG5cbiAgICAgICAgZXhwb3J0IHsgTXlGdW5jdGlvbiB9O1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgICR7ZW1wdHlJbXBvcnRzQ29tbWVudH1cbiAgICAgICAgJHtpbnB1dH1cbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXNuXFwndCBhZGQgY29tbWVudCB3aGVuIGluc2lkZSBjbGFzcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgY2xhc3MgRm9vIHtcbiAgICAgICAgICBjb25zdHJ1Y3RvcihlKSB7XG4gICAgICAgICAgICBzdXBlcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWV0aG9kKCkge1xuICAgICAgICAgICAgdmFyIG5ld0NsYXp6ID0gbmV3IENsYXp6KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgJHtlbXB0eUltcG9ydHNDb21tZW50fVxuICAgICAgICAke2lucHV0fVxuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IGFkZCBjb21tZW50IHdoZW4gaW5zaWRlIGFycm93IGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBleHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9BcnJheSA9IChhcnJheSkgPT4gKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW4gJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke2VtcHR5SW1wb3J0c0NvbW1lbnR9XG4gICAgICAgICR7aW5wdXR9XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzblxcJ3QgYWRkIGNvbW1lbnQgd2hlbiBpbnNpZGUgb2JqZWN0IGxpdGVyYWwgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBjb25zdCBsaXRlcmFsID0ge1xuICAgICAgICAgIG1ldGhvZCgpIHtcbiAgICAgICAgICAgIHZhciBuZXdDbGF6eiA9IG5ldyBDbGF6eigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke2VtcHR5SW1wb3J0c0NvbW1lbnR9XG4gICAgICAgICR7aW5wdXR9XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==