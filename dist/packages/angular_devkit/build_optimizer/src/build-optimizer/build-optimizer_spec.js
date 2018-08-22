"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-big-function
// tslint:disable-next-line:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const build_optimizer_1 = require("./build-optimizer");
describe('build-optimizer', () => {
    const imports = 'import { Injectable, Input, Component } from \'@angular/core\';';
    const clazz = 'var Clazz = (function () { function Clazz() { } return Clazz; }());';
    const staticProperty = 'Clazz.prop = 1;';
    const decorators = 'Clazz.decorators = [ { type: Injectable } ];';
    describe('basic functionality', () => {
        it('applies class-fold, scrub-file and prefix-functions to side-effect free modules', () => {
            const input = core_1.tags.stripIndent `
        ${imports}
        var __extends = (this && this.__extends) || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var ChangeDetectionStrategy;
        (function (ChangeDetectionStrategy) {
          ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
          ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
        })(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
        ${clazz}
        ${staticProperty}
        ${decorators}
        Clazz.propDecorators = { 'ngIf': [{ type: Input }] };
        Clazz.ctorParameters = function () { return [{type: Injectable}]; };
        var ComponentClazz = (function () {
          function ComponentClazz() { }
          __decorate([
            Input(),
            __metadata("design:type", Object)
          ], Clazz.prototype, "selected", void 0);
          ComponentClazz = __decorate([
            Component({
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: ['./app.component.css']
            }),
            __metadata("design:paramtypes", [Injectable])
          ], ComponentClazz);
          return ComponentClazz;
        }());
        var RenderType_MdOption = ɵcrt({ encapsulation: 2, styles: styles_MdOption});
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.oneLine `
        /** PURE_IMPORTS_START _angular_core,tslib PURE_IMPORTS_END */
        ${imports}
        import { __extends } from "tslib";
        var ChangeDetectionStrategy = /*@__PURE__*/ (function (ChangeDetectionStrategy) {
          ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
          ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
          return ChangeDetectionStrategy;
        })({});
        var Clazz = /*@__PURE__*/ (function () { function Clazz() { } ${staticProperty} return Clazz; }());
        var ComponentClazz = /*@__PURE__*/ (function () {
          function ComponentClazz() { }
          return ComponentClazz;
        }());
        var RenderType_MdOption = /*@__PURE__*/ ɵcrt({ encapsulation: 2, styles: styles_MdOption });
      `;
            // Check Angular 4/5 and unix/windows paths.
            const inputPaths = [
                '/node_modules/@angular/core/@angular/core.es5.js',
                '/node_modules/@angular/core/esm5/core.js',
                '\\node_modules\\@angular\\core\\@angular\\core.es5.js',
                '\\node_modules\\@angular\\core\\esm5\\core.js',
                '/project/file.ngfactory.js',
                '/project/file.ngstyle.js',
            ];
            inputPaths.forEach((inputFilePath) => {
                const boOutput = build_optimizer_1.buildOptimizer({ content: input, inputFilePath });
                expect(core_1.tags.oneLine `${boOutput.content}`).toEqual(output);
                expect(boOutput.emitSkipped).toEqual(false);
            });
        });
        it('supports flagging module as side-effect free', () => {
            const output = core_1.tags.oneLine `
        /** PURE_IMPORTS_START  PURE_IMPORTS_END */
        var RenderType_MdOption = /*@__PURE__*/ ɵcrt({ encapsulation: 2, styles: styles_MdOption });
      `;
            const input = core_1.tags.stripIndent `
        var RenderType_MdOption = ɵcrt({ encapsulation: 2, styles: styles_MdOption});
      `;
            const boOutput = build_optimizer_1.buildOptimizer({ content: input, isSideEffectFree: true });
            expect(core_1.tags.oneLine `${boOutput.content}`).toEqual(output);
            expect(boOutput.emitSkipped).toEqual(false);
        });
    });
    describe('resilience', () => {
        it('doesn\'t process files with invalid syntax by default', () => {
            const input = core_1.tags.oneLine `
        ))))invalid syntax
        ${clazz}
        Clazz.decorators = [ { type: Injectable } ];
      `;
            const boOutput = build_optimizer_1.buildOptimizer({ content: input });
            expect(boOutput.content).toBeFalsy();
            expect(boOutput.emitSkipped).toEqual(true);
        });
        it('throws on files with invalid syntax in strict mode', () => {
            const input = core_1.tags.oneLine `
        ))))invalid syntax
        ${clazz}
        Clazz.decorators = [ { type: Injectable } ];
      `;
            expect(() => build_optimizer_1.buildOptimizer({ content: input, strict: true })).toThrow();
        });
        // TODO: re-enable this test when updating to TypeScript >2.9.1.
        // The `prefix-classes` tests will also need to be adjusted.
        // See https://github.com/angular/devkit/pull/998#issuecomment-393867606 for more info.
        xit(`doesn't exceed call stack size when type checking very big classes`, () => {
            // BigClass with a thousand methods.
            // Clazz is included with ctorParameters to trigger transforms with type checking.
            const input = `
        var BigClass = /** @class */ (function () {
          function BigClass() {
          }
          ${Array.from(new Array(1000)).map((_v, i) => `BigClass.prototype.method${i} = function () { return this.myVar; };`).join('\n')}
          return BigClass;
        }());
        ${clazz}
        Clazz.ctorParameters = function () { return []; };
      `;
            let boOutput;
            expect(() => {
                boOutput = build_optimizer_1.buildOptimizer({ content: input });
                expect(boOutput.emitSkipped).toEqual(false);
            }).not.toThrow();
        });
    });
    describe('whitelisted modules', () => {
        // This statement is considered pure by getPrefixFunctionsTransformer on whitelisted modules.
        const input = 'console.log(42);';
        const output = '/*@__PURE__*/ console.log(42);';
        it('should process whitelisted modules', () => {
            const inputFilePath = '/node_modules/@angular/core/@angular/core.es5.js';
            const boOutput = build_optimizer_1.buildOptimizer({ content: input, inputFilePath });
            expect(boOutput.content).toContain(output);
            expect(boOutput.emitSkipped).toEqual(false);
        });
        it('should not process non-whitelisted modules', () => {
            const inputFilePath = '/node_modules/other-package/core.es5.js';
            const boOutput = build_optimizer_1.buildOptimizer({ content: input, inputFilePath });
            expect(boOutput.emitSkipped).toEqual(true);
        });
        it('should not process non-whitelisted umd modules', () => {
            const inputFilePath = '/node_modules/other_lib/index.js';
            const boOutput = build_optimizer_1.buildOptimizer({ content: input, inputFilePath });
            expect(boOutput.emitSkipped).toEqual(true);
        });
    });
    describe('sourcemaps', () => {
        const transformableInput = core_1.tags.oneLine `
      ${imports}
      ${clazz}
      ${decorators}
    `;
        it('doesn\'t produce sourcemaps by default', () => {
            expect(build_optimizer_1.buildOptimizer({ content: transformableInput }).sourceMap).toBeFalsy();
        });
        it('produces sourcemaps', () => {
            expect(build_optimizer_1.buildOptimizer({ content: transformableInput, emitSourceMap: true }).sourceMap).toBeTruthy();
        });
        // TODO: re-enable this test, it was temporarily disabled as part of
        // https://github.com/angular/devkit/pull/842
        xit('doesn\'t produce sourcemaps when emitting was skipped', () => {
            const ignoredInput = core_1.tags.oneLine `
        var Clazz = (function () { function Clazz() { } return Clazz; }());
        ${staticProperty}
      `;
            const invalidInput = core_1.tags.oneLine `
        ))))invalid syntax
        ${clazz}
        Clazz.decorators = [ { type: Injectable } ];
      `;
            const ignoredOutput = build_optimizer_1.buildOptimizer({ content: ignoredInput, emitSourceMap: true });
            expect(ignoredOutput.emitSkipped).toBeTruthy();
            expect(ignoredOutput.sourceMap).toBeFalsy();
            const invalidOutput = build_optimizer_1.buildOptimizer({ content: invalidInput, emitSourceMap: true });
            expect(invalidOutput.emitSkipped).toBeTruthy();
            expect(invalidOutput.sourceMap).toBeFalsy();
        });
        it('emits sources content', () => {
            const sourceMap = build_optimizer_1.buildOptimizer({ content: transformableInput, emitSourceMap: true }).sourceMap;
            const sourceContent = sourceMap.sourcesContent;
            expect(sourceContent[0]).toEqual(transformableInput);
        });
        it('uses empty strings if inputFilePath and outputFilePath is not provided', () => {
            const { content, sourceMap } = build_optimizer_1.buildOptimizer({ content: transformableInput, emitSourceMap: true });
            if (!sourceMap) {
                throw new Error('sourceMap was not generated.');
            }
            expect(sourceMap.file).toEqual('');
            expect(sourceMap.sources[0]).toEqual('');
            expect(content).not.toContain(`sourceMappingURL`);
        });
        it('uses inputFilePath and outputFilePath if provided', () => {
            const inputFilePath = '/path/to/file.js';
            const outputFilePath = '/path/to/file.bo.js';
            const { content, sourceMap } = build_optimizer_1.buildOptimizer({
                content: transformableInput,
                emitSourceMap: true,
                inputFilePath,
                outputFilePath,
            });
            if (!sourceMap) {
                throw new Error('sourceMap was not generated.');
            }
            expect(sourceMap.file).toEqual(outputFilePath);
            expect(sourceMap.sources[0]).toEqual(inputFilePath);
            expect(content).toContain(`sourceMappingURL=${outputFilePath}.map`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL2J1aWxkLW9wdGltaXplcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWlDO0FBQ2pDLG9EQUFvRDtBQUNwRCwrQ0FBNEM7QUFHNUMsdURBQW1EO0FBR25ELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsTUFBTSxPQUFPLEdBQUcsaUVBQWlFLENBQUM7SUFDbEYsTUFBTSxLQUFLLEdBQUcscUVBQXFFLENBQUM7SUFDcEYsTUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUM7SUFDekMsTUFBTSxVQUFVLEdBQUcsOENBQThDLENBQUM7SUFFbEUsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUNuQyxFQUFFLENBQUMsaUZBQWlGLEVBQUUsR0FBRyxFQUFFO1lBQ3pGLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7VUFDMUIsT0FBTzs7Ozs7Ozs7Ozs7VUFXUCxLQUFLO1VBQ0wsY0FBYztVQUNkLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0JiLENBQUM7WUFDRixpQ0FBaUM7WUFDakMsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQTs7VUFFdkIsT0FBTzs7Ozs7Ozt3RUFPdUQsY0FBYzs7Ozs7O09BTS9FLENBQUM7WUFFRiw0Q0FBNEM7WUFDNUMsTUFBTSxVQUFVLEdBQUc7Z0JBQ2pCLGtEQUFrRDtnQkFDbEQsMENBQTBDO2dCQUMxQyx1REFBdUQ7Z0JBQ3ZELCtDQUErQztnQkFDL0MsNEJBQTRCO2dCQUM1QiwwQkFBMEI7YUFDM0IsQ0FBQztZQUVGLFVBQVUsQ0FBQyxPQUFP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QyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxNQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQztZQUN6QyxNQUFNLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQztZQUM3QyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLGdDQUFjLENBQUM7Z0JBQzVDLE9BQU8sRUFBRSxrQkFBa0I7Z0JBQzNCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixhQUFhO2dCQUNiLGNBQWM7YUFDZixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQzthQUNqRDtZQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLGNBQWMsTUFBTSxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8tYmlnLWZ1bmN0aW9uXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyB0YWdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgUmF3U291cmNlTWFwIH0gZnJvbSAnc291cmNlLW1hcCc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1KYXZhc2NyaXB0T3V0cHV0IH0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBidWlsZE9wdGltaXplciB9IGZyb20gJy4vYnVpbGQtb3B0aW1pemVyJztcblxuXG5kZXNjcmliZSgnYnVpbGQtb3B0aW1pemVyJywgKCkgPT4ge1xuICBjb25zdCBpbXBvcnRzID0gJ2ltcG9ydCB7IEluamVjdGFibGUsIElucHV0LCBDb21wb25lbnQgfSBmcm9tIFxcJ0Bhbmd1bGFyL2NvcmVcXCc7JztcbiAgY29uc3QgY2xhenogPSAndmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gQ2xhenooKSB7IH0gcmV0dXJuIENsYXp6OyB9KCkpOyc7XG4gIGNvbnN0IHN0YXRpY1Byb3BlcnR5ID0gJ0NsYXp6LnByb3AgPSAxOyc7XG4gIGNvbnN0IGRlY29yYXRvcnMgPSAnQ2xhenouZGVjb3JhdG9ycyA9IFsgeyB0eXBlOiBJbmplY3RhYmxlIH0gXTsnO1xuXG4gIGRlc2NyaWJlKCdiYXNpYyBmdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdhcHBsaWVzIGNsYXNzLWZvbGQsIHNjcnViLWZpbGUgYW5kIHByZWZpeC1mdW5jdGlvbnMgdG8gc2lkZS1lZmZlY3QgZnJlZSBtb2R1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke2ltcG9ydHN9XG4gICAgICAgIHZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgICAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTtcbiAgICAgICAgKGZ1bmN0aW9uIChDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSkge1xuICAgICAgICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5W0NoYW5nZURldGVjdGlvblN0cmF0ZWd5W1wiT25QdXNoXCJdID0gMF0gPSBcIk9uUHVzaFwiO1xuICAgICAgICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5W0NoYW5nZURldGVjdGlvblN0cmF0ZWd5W1wiRGVmYXVsdFwiXSA9IDFdID0gXCJEZWZhdWx0XCI7XG4gICAgICAgIH0pKENoYW5nZURldGVjdGlvblN0cmF0ZWd5IHx8IChDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IHt9KSk7XG4gICAgICAgICR7Y2xhenp9XG4gICAgICAgICR7c3RhdGljUHJvcGVydHl9XG4gICAgICAgICR7ZGVjb3JhdG9yc31cbiAgICAgICAgQ2xhenoucHJvcERlY29yYXRvcnMgPSB7ICduZ0lmJzogW3sgdHlwZTogSW5wdXQgfV0gfTtcbiAgICAgICAgQ2xhenouY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbe3R5cGU6IEluamVjdGFibGV9XTsgfTtcbiAgICAgICAgdmFyIENvbXBvbmVudENsYXp6ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDb21wb25lbnRDbGF6eigpIHsgfVxuICAgICAgICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXG4gICAgICAgICAgXSwgQ2xhenoucHJvdG90eXBlLCBcInNlbGVjdGVkXCIsIHZvaWQgMCk7XG4gICAgICAgICAgQ29tcG9uZW50Q2xhenogPSBfX2RlY29yYXRlKFtcbiAgICAgICAgICAgIENvbXBvbmVudCh7XG4gICAgICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICAgICAgc3R5bGVVcmxzOiBbJy4vYXBwLmNvbXBvbmVudC5jc3MnXVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0luamVjdGFibGVdKVxuICAgICAgICAgIF0sIENvbXBvbmVudENsYXp6KTtcbiAgICAgICAgICByZXR1cm4gQ29tcG9uZW50Q2xheno7XG4gICAgICAgIH0oKSk7XG4gICAgICAgIHZhciBSZW5kZXJUeXBlX01kT3B0aW9uID0gybVjcnQoeyBlbmNhcHN1bGF0aW9uOiAyLCBzdHlsZXM6IHN0eWxlc19NZE9wdGlvbn0pO1xuICAgICAgYDtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5vbmVMaW5lYFxuICAgICAgICAvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9hbmd1bGFyX2NvcmUsdHNsaWIgUFVSRV9JTVBPUlRTX0VORCAqL1xuICAgICAgICAke2ltcG9ydHN9XG4gICAgICAgIGltcG9ydCB7IF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuICAgICAgICB2YXIgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtcIk9uUHVzaFwiXSA9IDBdID0gXCJPblB1c2hcIjtcbiAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtcIkRlZmF1bHRcIl0gPSAxXSA9IFwiRGVmYXVsdFwiO1xuICAgICAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTtcbiAgICAgICAgfSkoe30pO1xuICAgICAgICB2YXIgQ2xhenogPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIENsYXp6KCkgeyB9ICR7c3RhdGljUHJvcGVydHl9IHJldHVybiBDbGF6ejsgfSgpKTtcbiAgICAgICAgdmFyIENvbXBvbmVudENsYXp6ID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENvbXBvbmVudENsYXp6KCkgeyB9XG4gICAgICAgICAgcmV0dXJuIENvbXBvbmVudENsYXp6O1xuICAgICAgICB9KCkpO1xuICAgICAgICB2YXIgUmVuZGVyVHlwZV9NZE9wdGlvbiA9IC8qQF9fUFVSRV9fKi8gybVjcnQoeyBlbmNhcHN1bGF0aW9uOiAyLCBzdHlsZXM6IHN0eWxlc19NZE9wdGlvbiB9KTtcbiAgICAgIGA7XG5cbiAgICAgIC8vIENoZWNrIEFuZ3VsYXIgNC81IGFuZCB1bml4L3dpbmRvd3MgcGF0aHMuXG4gICAgICBjb25zdCBpbnB1dFBhdGhzID0gW1xuICAgICAgICAnL25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlL0Bhbmd1bGFyL2NvcmUuZXM1LmpzJyxcbiAgICAgICAgJy9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZS9lc201L2NvcmUuanMnLFxuICAgICAgICAnXFxcXG5vZGVfbW9kdWxlc1xcXFxAYW5ndWxhclxcXFxjb3JlXFxcXEBhbmd1bGFyXFxcXGNvcmUuZXM1LmpzJyxcbiAgICAgICAgJ1xcXFxub2RlX21vZHVsZXNcXFxcQGFuZ3VsYXJcXFxcY29yZVxcXFxlc201XFxcXGNvcmUuanMnLFxuICAgICAgICAnL3Byb2plY3QvZmlsZS5uZ2ZhY3RvcnkuanMnLFxuICAgICAgICAnL3Byb2plY3QvZmlsZS5uZ3N0eWxlLmpzJyxcbiAgICAgIF07XG5cbiAgICAgIGlucHV0UGF0aHMuZm9yRWFjaCgoaW5wdXRGaWxlUGF0aCkgPT4ge1xuICAgICAgICBjb25zdCBib091dHB1dCA9IGJ1aWxkT3B0aW1pemVyKHsgY29udGVudDogaW5wdXQsIGlucHV0RmlsZVBhdGggfSk7XG4gICAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtib091dHB1dC5jb250ZW50fWApLnRvRXF1YWwob3V0cHV0KTtcbiAgICAgICAgZXhwZWN0KGJvT3V0cHV0LmVtaXRTa2lwcGVkKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N1cHBvcnRzIGZsYWdnaW5nIG1vZHVsZSBhcyBzaWRlLWVmZmVjdCBmcmVlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5vbmVMaW5lYFxuICAgICAgICAvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG4gICAgICAgIHZhciBSZW5kZXJUeXBlX01kT3B0aW9uID0gLypAX19QVVJFX18qLyDJtWNydCh7IGVuY2Fwc3VsYXRpb246IDIsIHN0eWxlczogc3R5bGVzX01kT3B0aW9uIH0pO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgdmFyIFJlbmRlclR5cGVfTWRPcHRpb24gPSDJtWNydCh7IGVuY2Fwc3VsYXRpb246IDIsIHN0eWxlczogc3R5bGVzX01kT3B0aW9ufSk7XG4gICAgICBgO1xuXG4gICAgICBjb25zdCBib091dHB1dCA9IGJ1aWxkT3B0aW1pemVyKHsgY29udGVudDogaW5wdXQsIGlzU2lkZUVmZmVjdEZyZWU6IHRydWUgfSk7XG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7Ym9PdXRwdXQuY29udGVudH1gKS50b0VxdWFsKG91dHB1dCk7XG4gICAgICBleHBlY3QoYm9PdXRwdXQuZW1pdFNraXBwZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCdyZXNpbGllbmNlJywgKCkgPT4ge1xuICAgIGl0KCdkb2VzblxcJ3QgcHJvY2VzcyBmaWxlcyB3aXRoIGludmFsaWQgc3ludGF4IGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Mub25lTGluZWBcbiAgICAgICAgKSkpKWludmFsaWQgc3ludGF4XG4gICAgICAgICR7Y2xhenp9XG4gICAgICAgIENsYXp6LmRlY29yYXRvcnMgPSBbIHsgdHlwZTogSW5qZWN0YWJsZSB9IF07XG4gICAgICBgO1xuXG4gICAgICBjb25zdCBib091dHB1dCA9IGJ1aWxkT3B0aW1pemVyKHsgY29udGVudDogaW5wdXQgfSk7XG4gICAgICBleHBlY3QoYm9PdXRwdXQuY29udGVudCkudG9CZUZhbHN5KCk7XG4gICAgICBleHBlY3QoYm9PdXRwdXQuZW1pdFNraXBwZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgndGhyb3dzIG9uIGZpbGVzIHdpdGggaW52YWxpZCBzeW50YXggaW4gc3RyaWN0IG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Mub25lTGluZWBcbiAgICAgICAgKSkpKWludmFsaWQgc3ludGF4XG4gICAgICAgICR7Y2xhenp9XG4gICAgICAgIENsYXp6LmRlY29yYXRvcnMgPSBbIHsgdHlwZTogSW5qZWN0YWJsZSB9IF07XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QoKCkgPT4gYnVpbGRPcHRpbWl6ZXIoeyBjb250ZW50OiBpbnB1dCwgc3RyaWN0OiB0cnVlIH0pKS50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiByZS1lbmFibGUgdGhpcyB0ZXN0IHdoZW4gdXBkYXRpbmcgdG8gVHlwZVNjcmlwdCA+Mi45LjEuXG4gICAgLy8gVGhlIGBwcmVmaXgtY2xhc3Nlc2AgdGVzdHMgd2lsbCBhbHNvIG5lZWQgdG8gYmUgYWRqdXN0ZWQuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2RldmtpdC9wdWxsLzk5OCNpc3N1ZWNvbW1lbnQtMzkzODY3NjA2IGZvciBtb3JlIGluZm8uXG4gICAgeGl0KGBkb2Vzbid0IGV4Y2VlZCBjYWxsIHN0YWNrIHNpemUgd2hlbiB0eXBlIGNoZWNraW5nIHZlcnkgYmlnIGNsYXNzZXNgLCAoKSA9PiB7XG4gICAgICAvLyBCaWdDbGFzcyB3aXRoIGEgdGhvdXNhbmQgbWV0aG9kcy5cbiAgICAgIC8vIENsYXp6IGlzIGluY2x1ZGVkIHdpdGggY3RvclBhcmFtZXRlcnMgdG8gdHJpZ2dlciB0cmFuc2Zvcm1zIHdpdGggdHlwZSBjaGVja2luZy5cbiAgICAgIGNvbnN0IGlucHV0ID0gYFxuICAgICAgICB2YXIgQmlnQ2xhc3MgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQmlnQ2xhc3MoKSB7XG4gICAgICAgICAgfVxuICAgICAgICAgICR7QXJyYXkuZnJvbShuZXcgQXJyYXkoMTAwMCkpLm1hcCgoX3YsIGkpID0+XG4gICAgICAgICAgICBgQmlnQ2xhc3MucHJvdG90eXBlLm1ldGhvZCR7aX0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm15VmFyOyB9O2AsXG4gICAgICAgICAgKS5qb2luKCdcXG4nKX1cbiAgICAgICAgICByZXR1cm4gQmlnQ2xhc3M7XG4gICAgICAgIH0oKSk7XG4gICAgICAgICR7Y2xhenp9XG4gICAgICAgIENsYXp6LmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4gICAgICBgO1xuXG4gICAgICBsZXQgYm9PdXRwdXQ6IFRyYW5zZm9ybUphdmFzY3JpcHRPdXRwdXQ7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBib091dHB1dCA9IGJ1aWxkT3B0aW1pemVyKHsgY29udGVudDogaW5wdXQgfSk7XG4gICAgICAgIGV4cGVjdChib091dHB1dC5lbWl0U2tpcHBlZCkudG9FcXVhbChmYWxzZSk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hpdGVsaXN0ZWQgbW9kdWxlcycsICgpID0+IHtcbiAgICAvLyBUaGlzIHN0YXRlbWVudCBpcyBjb25zaWRlcmVkIHB1cmUgYnkgZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIgb24gd2hpdGVsaXN0ZWQgbW9kdWxlcy5cbiAgICBjb25zdCBpbnB1dCA9ICdjb25zb2xlLmxvZyg0Mik7JztcbiAgICBjb25zdCBvdXRwdXQgPSAnLypAX19QVVJFX18qLyBjb25zb2xlLmxvZyg0Mik7JztcblxuICAgIGl0KCdzaG91bGQgcHJvY2VzcyB3aGl0ZWxpc3RlZCBtb2R1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRGaWxlUGF0aCA9ICcvbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUvQGFuZ3VsYXIvY29yZS5lczUuanMnO1xuICAgICAgY29uc3QgYm9PdXRwdXQgPSBidWlsZE9wdGltaXplcih7IGNvbnRlbnQ6IGlucHV0LCBpbnB1dEZpbGVQYXRoIH0pO1xuICAgICAgZXhwZWN0KGJvT3V0cHV0LmNvbnRlbnQpLnRvQ29udGFpbihvdXRwdXQpO1xuICAgICAgZXhwZWN0KGJvT3V0cHV0LmVtaXRTa2lwcGVkKS50b0VxdWFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHByb2Nlc3Mgbm9uLXdoaXRlbGlzdGVkIG1vZHVsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dEZpbGVQYXRoID0gJy9ub2RlX21vZHVsZXMvb3RoZXItcGFja2FnZS9jb3JlLmVzNS5qcyc7XG4gICAgICBjb25zdCBib091dHB1dCA9IGJ1aWxkT3B0aW1pemVyKHsgY29udGVudDogaW5wdXQsIGlucHV0RmlsZVBhdGggfSk7XG4gICAgICBleHBlY3QoYm9PdXRwdXQuZW1pdFNraXBwZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwcm9jZXNzIG5vbi13aGl0ZWxpc3RlZCB1bWQgbW9kdWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0RmlsZVBhdGggPSAnL25vZGVfbW9kdWxlcy9vdGhlcl9saWIvaW5kZXguanMnO1xuICAgICAgY29uc3QgYm9PdXRwdXQgPSBidWlsZE9wdGltaXplcih7IGNvbnRlbnQ6IGlucHV0LCBpbnB1dEZpbGVQYXRoIH0pO1xuICAgICAgZXhwZWN0KGJvT3V0cHV0LmVtaXRTa2lwcGVkKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc291cmNlbWFwcycsICgpID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm1hYmxlSW5wdXQgPSB0YWdzLm9uZUxpbmVgXG4gICAgICAke2ltcG9ydHN9XG4gICAgICAke2NsYXp6fVxuICAgICAgJHtkZWNvcmF0b3JzfVxuICAgIGA7XG5cbiAgICBpdCgnZG9lc25cXCd0IHByb2R1Y2Ugc291cmNlbWFwcyBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGJ1aWxkT3B0aW1pemVyKHsgY29udGVudDogdHJhbnNmb3JtYWJsZUlucHV0IH0pLnNvdXJjZU1hcCkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgncHJvZHVjZXMgc291cmNlbWFwcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChidWlsZE9wdGltaXplcihcbiAgICAgICAgeyBjb250ZW50OiB0cmFuc2Zvcm1hYmxlSW5wdXQsIGVtaXRTb3VyY2VNYXA6IHRydWUgfSxcbiAgICAgICkuc291cmNlTWFwKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiByZS1lbmFibGUgdGhpcyB0ZXN0LCBpdCB3YXMgdGVtcG9yYXJpbHkgZGlzYWJsZWQgYXMgcGFydCBvZlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2RldmtpdC9wdWxsLzg0MlxuICAgIHhpdCgnZG9lc25cXCd0IHByb2R1Y2Ugc291cmNlbWFwcyB3aGVuIGVtaXR0aW5nIHdhcyBza2lwcGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgaWdub3JlZElucHV0ID0gdGFncy5vbmVMaW5lYFxuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBDbGF6eigpIHsgfSByZXR1cm4gQ2xheno7IH0oKSk7XG4gICAgICAgICR7c3RhdGljUHJvcGVydHl9XG4gICAgICBgO1xuICAgICAgY29uc3QgaW52YWxpZElucHV0ID0gdGFncy5vbmVMaW5lYFxuICAgICAgICApKSkpaW52YWxpZCBzeW50YXhcbiAgICAgICAgJHtjbGF6en1cbiAgICAgICAgQ2xhenouZGVjb3JhdG9ycyA9IFsgeyB0eXBlOiBJbmplY3RhYmxlIH0gXTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IGlnbm9yZWRPdXRwdXQgPSBidWlsZE9wdGltaXplcih7IGNvbnRlbnQ6IGlnbm9yZWRJbnB1dCwgZW1pdFNvdXJjZU1hcDogdHJ1ZSB9KTtcbiAgICAgIGV4cGVjdChpZ25vcmVkT3V0cHV0LmVtaXRTa2lwcGVkKS50b0JlVHJ1dGh5KCk7XG4gICAgICBleHBlY3QoaWdub3JlZE91dHB1dC5zb3VyY2VNYXApLnRvQmVGYWxzeSgpO1xuXG4gICAgICBjb25zdCBpbnZhbGlkT3V0cHV0ID0gYnVpbGRPcHRpbWl6ZXIoeyBjb250ZW50OiBpbnZhbGlkSW5wdXQsIGVtaXRTb3VyY2VNYXA6IHRydWUgfSk7XG4gICAgICBleHBlY3QoaW52YWxpZE91dHB1dC5lbWl0U2tpcHBlZCkudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KGludmFsaWRPdXRwdXQuc291cmNlTWFwKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdlbWl0cyBzb3VyY2VzIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VNYXAgPSBidWlsZE9wdGltaXplcihcbiAgICAgICAgeyBjb250ZW50OiB0cmFuc2Zvcm1hYmxlSW5wdXQsIGVtaXRTb3VyY2VNYXA6IHRydWUgfSxcbiAgICAgICkuc291cmNlTWFwIGFzIFJhd1NvdXJjZU1hcDtcbiAgICAgIGNvbnN0IHNvdXJjZUNvbnRlbnQgPSBzb3VyY2VNYXAuc291cmNlc0NvbnRlbnQgYXMgc3RyaW5nW107XG4gICAgICBleHBlY3Qoc291cmNlQ29udGVudFswXSkudG9FcXVhbCh0cmFuc2Zvcm1hYmxlSW5wdXQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgZW1wdHkgc3RyaW5ncyBpZiBpbnB1dEZpbGVQYXRoIGFuZCBvdXRwdXRGaWxlUGF0aCBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRlbnQsIHNvdXJjZU1hcCB9ID0gYnVpbGRPcHRpbWl6ZXIoXG4gICAgICAgIHsgY29udGVudDogdHJhbnNmb3JtYWJsZUlucHV0LCBlbWl0U291cmNlTWFwOiB0cnVlIH0pO1xuXG4gICAgICBpZiAoIXNvdXJjZU1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZU1hcCB3YXMgbm90IGdlbmVyYXRlZC4nKTtcbiAgICAgIH1cbiAgICAgIGV4cGVjdChzb3VyY2VNYXAuZmlsZSkudG9FcXVhbCgnJyk7XG4gICAgICBleHBlY3Qoc291cmNlTWFwLnNvdXJjZXNbMF0pLnRvRXF1YWwoJycpO1xuICAgICAgZXhwZWN0KGNvbnRlbnQpLm5vdC50b0NvbnRhaW4oYHNvdXJjZU1hcHBpbmdVUkxgKTtcbiAgICB9KTtcblxuICAgIGl0KCd1c2VzIGlucHV0RmlsZVBhdGggYW5kIG91dHB1dEZpbGVQYXRoIGlmIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRGaWxlUGF0aCA9ICcvcGF0aC90by9maWxlLmpzJztcbiAgICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gJy9wYXRoL3RvL2ZpbGUuYm8uanMnO1xuICAgICAgY29uc3QgeyBjb250ZW50LCBzb3VyY2VNYXAgfSA9IGJ1aWxkT3B0aW1pemVyKHtcbiAgICAgICAgY29udGVudDogdHJhbnNmb3JtYWJsZUlucHV0LFxuICAgICAgICBlbWl0U291cmNlTWFwOiB0cnVlLFxuICAgICAgICBpbnB1dEZpbGVQYXRoLFxuICAgICAgICBvdXRwdXRGaWxlUGF0aCxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXNvdXJjZU1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZU1hcCB3YXMgbm90IGdlbmVyYXRlZC4nKTtcbiAgICAgIH1cbiAgICAgIGV4cGVjdChzb3VyY2VNYXAuZmlsZSkudG9FcXVhbChvdXRwdXRGaWxlUGF0aCk7XG4gICAgICBleHBlY3Qoc291cmNlTWFwLnNvdXJjZXNbMF0pLnRvRXF1YWwoaW5wdXRGaWxlUGF0aCk7XG4gICAgICBleHBlY3QoY29udGVudCkudG9Db250YWluKGBzb3VyY2VNYXBwaW5nVVJMPSR7b3V0cHV0RmlsZVBhdGh9Lm1hcGApO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=