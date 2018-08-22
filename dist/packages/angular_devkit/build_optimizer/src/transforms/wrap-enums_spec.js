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
const wrap_enums_1 = require("./wrap-enums");
const transform = (content) => transform_javascript_1.transformJavascript({ content, getTransforms: [wrap_enums_1.getWrapEnumsTransformer] }).content;
describe('wrap-enums', () => {
    it('wraps ts 2.2 enums in IIFE', () => {
        const input = core_1.tags.stripIndent `
      export var ChangeDetectionStrategy = {};
      ChangeDetectionStrategy.OnPush = 0;
      ChangeDetectionStrategy.Default = 1;
      ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = "OnPush";
      ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = "Default";
    `;
        const output = core_1.tags.stripIndent `
      export var ChangeDetectionStrategy = /*@__PURE__*/ (function () {
        var ChangeDetectionStrategy = {};
        ChangeDetectionStrategy.OnPush = 0;
        ChangeDetectionStrategy.Default = 1;
        ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = "OnPush";
        ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = "Default";
        return ChangeDetectionStrategy;
      }());
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('wraps ts 2.3 - 2.6 enums in IIFE', () => {
        const input = core_1.tags.stripIndent `
      export var ChangeDetectionStrategy;
      (function (ChangeDetectionStrategy) {
          ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
          ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
      })(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
    `;
        const output = core_1.tags.stripIndent `
      export var ChangeDetectionStrategy = /*@__PURE__*/ (function (ChangeDetectionStrategy) {
        ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
        ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
        return ChangeDetectionStrategy;
      })({});
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('wraps ts 2.3 - 2.6 enums in IIFE, even if they have funny numbers', () => {
        const input = core_1.tags.stripIndent `
      export var AnimatorControlState;
      (function (AnimatorControlState) {
          AnimatorControlState[AnimatorControlState["INITIALIZED"] = 1] = "INITIALIZED";
          AnimatorControlState[AnimatorControlState["STARTED"] = 2] = "STARTED";
          AnimatorControlState[AnimatorControlState["FINISHED"] = 3] = "FINISHED";
          AnimatorControlState[AnimatorControlState["DESTROYED"] = 4] = "DESTROYED";
      })(AnimatorControlState || (AnimatorControlState = {}));
    `;
        const output = core_1.tags.stripIndent `
      export var AnimatorControlState = /*@__PURE__*/ (function (AnimatorControlState) {
          AnimatorControlState[AnimatorControlState["INITIALIZED"] = 1] = "INITIALIZED";
          AnimatorControlState[AnimatorControlState["STARTED"] = 2] = "STARTED";
          AnimatorControlState[AnimatorControlState["FINISHED"] = 3] = "FINISHED";
          AnimatorControlState[AnimatorControlState["DESTROYED"] = 4] = "DESTROYED";
          return AnimatorControlState;
      })({});
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('wraps tsickle enums in IIFE', () => {
        const input = core_1.tags.stripIndent `
      /** @enum {number} */
      var FormatWidth = {
        Short: 0,
        Medium: 1,
        Long: 2,
        Full: 3,
      };
      FormatWidth[FormatWidth.Short] = "Short";
      FormatWidth[FormatWidth.Medium] = "Medium";
      FormatWidth[FormatWidth.Long] = "Long";
      FormatWidth[FormatWidth.Full] = "Full";
    `;
        const output = core_1.tags.stripIndent `
      /** @enum {number} */ var FormatWidth = /*@__PURE__*/ (function () {
        var FormatWidth = {
          Short: 0,
          Medium: 1,
          Long: 2,
          Full: 3,
        };
        FormatWidth[FormatWidth.Short] = "Short";
        FormatWidth[FormatWidth.Medium] = "Medium";
        FormatWidth[FormatWidth.Long] = "Long";
        FormatWidth[FormatWidth.Full] = "Full";
        return FormatWidth;
      }());
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('wraps enums with multi-line comments in IIFE', () => {
        const input = core_1.tags.stripIndent `
      /**
       * Supported http methods.
       * @deprecated use @angular/common/http instead
       */
      var RequestMethod;
      /**
       * Supported http methods.
       * @deprecated use @angular/common/http instead
       */
      (function (RequestMethod) {
          RequestMethod[RequestMethod["Get"] = 0] = "Get";
          RequestMethod[RequestMethod["Post"] = 1] = "Post";
          RequestMethod[RequestMethod["Put"] = 2] = "Put";
          RequestMethod[RequestMethod["Delete"] = 3] = "Delete";
          RequestMethod[RequestMethod["Options"] = 4] = "Options";
          RequestMethod[RequestMethod["Head"] = 5] = "Head";
          RequestMethod[RequestMethod["Patch"] = 6] = "Patch";
      })(RequestMethod || (RequestMethod = {}));
    `;
        // We need to interpolate this space because our editorconfig automatically strips
        // trailing whitespace.
        const space = ' ';
        const output = core_1.tags.stripIndent `
      /**
       * Supported http methods.
       * @deprecated use @angular/common/http instead
       */
      var RequestMethod =${space}
       /**
       * Supported http methods.
       * @deprecated use @angular/common/http instead
       */
      /*@__PURE__*/ (function (RequestMethod) {
          RequestMethod[RequestMethod["Get"] = 0] = "Get";
          RequestMethod[RequestMethod["Post"] = 1] = "Post";
          RequestMethod[RequestMethod["Put"] = 2] = "Put";
          RequestMethod[RequestMethod["Delete"] = 3] = "Delete";
          RequestMethod[RequestMethod["Options"] = 4] = "Options";
          RequestMethod[RequestMethod["Head"] = 5] = "Head";
          RequestMethod[RequestMethod["Patch"] = 6] = "Patch";
          return RequestMethod;
      })({});
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('wraps exported enums in IIFE', () => {
        const input = core_1.tags.stripIndent `
      var ExportEnum;
      (function (ExportEnum) {
        ExportEnum[ExportEnum["A"] = 0] = "A";
        ExportEnum[ExportEnum["B"] = 1] = "B";
        ExportEnum[ExportEnum["C"] = 2] = "C";
      })(ExportEnum = exports.ExportEnum || (exports.ExportEnum = {}));
    `;
        const output = core_1.tags.stripIndent `
      var ExportEnum = exports.ExportEnum = /*@__PURE__*/ (function (ExportEnum) {
        ExportEnum[ExportEnum["A"] = 0] = "A";
        ExportEnum[ExportEnum["B"] = 1] = "B";
        ExportEnum[ExportEnum["C"] = 2] = "C";
        return ExportEnum;
      })(exports.ExportEnum || {});
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC1lbnVtc19zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvd3JhcC1lbnVtc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0RBQW9EO0FBQ3BELCtDQUE0QztBQUM1QywwRUFBc0U7QUFDdEUsNkNBQXVEO0FBR3ZELE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQywwQ0FBbUIsQ0FDeEQsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsb0NBQXVCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBRWpFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7O0tBTTdCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7S0FTOUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQzFDLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7OztLQU03QixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7O0tBTTlCLENBQUM7UUFFRixNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRTtRQUMzRSxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7OztLQVE3QixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7Ozs7S0FROUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7Ozs7OztLQVk3QixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7S0FjOUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FtQjdCLENBQUM7UUFDRixrRkFBa0Y7UUFDbEYsdUJBQXVCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNsQixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7OzsyQkFLUixLQUFLOzs7Ozs7Ozs7Ozs7Ozs7S0FlM0IsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7S0FPN0IsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7S0FPOUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1KYXZhc2NyaXB0IH0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRXcmFwRW51bXNUcmFuc2Zvcm1lciB9IGZyb20gJy4vd3JhcC1lbnVtcyc7XG5cblxuY29uc3QgdHJhbnNmb3JtID0gKGNvbnRlbnQ6IHN0cmluZykgPT4gdHJhbnNmb3JtSmF2YXNjcmlwdChcbiAgeyBjb250ZW50LCBnZXRUcmFuc2Zvcm1zOiBbZ2V0V3JhcEVudW1zVHJhbnNmb3JtZXJdIH0pLmNvbnRlbnQ7XG5cbmRlc2NyaWJlKCd3cmFwLWVudW1zJywgKCkgPT4ge1xuICBpdCgnd3JhcHMgdHMgMi4yIGVudW1zIGluIElJRkUnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgZXhwb3J0IHZhciBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IHt9O1xuICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoID0gMDtcbiAgICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQgPSAxO1xuICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lbQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXSA9IFwiT25QdXNoXCI7XG4gICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0XSA9IFwiRGVmYXVsdFwiO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGV4cG9ydCB2YXIgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IHt9O1xuICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2ggPSAwO1xuICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0ID0gMTtcbiAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lbQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXSA9IFwiT25QdXNoXCI7XG4gICAgICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5W0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHRdID0gXCJEZWZhdWx0XCI7XG4gICAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTtcbiAgICAgIH0oKSk7XG4gICAgYDtcblxuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICBpdCgnd3JhcHMgdHMgMi4zIC0gMi42IGVudW1zIGluIElJRkUnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgZXhwb3J0IHZhciBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTtcbiAgICAgIChmdW5jdGlvbiAoQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtcIk9uUHVzaFwiXSA9IDBdID0gXCJPblB1c2hcIjtcbiAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtcIkRlZmF1bHRcIl0gPSAxXSA9IFwiRGVmYXVsdFwiO1xuICAgICAgfSkoQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfHwgKENoYW5nZURldGVjdGlvblN0cmF0ZWd5ID0ge30pKTtcbiAgICBgO1xuICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICBleHBvcnQgdmFyIENoYW5nZURldGVjdGlvblN0cmF0ZWd5ID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKENoYW5nZURldGVjdGlvblN0cmF0ZWd5KSB7XG4gICAgICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5W0NoYW5nZURldGVjdGlvblN0cmF0ZWd5W1wiT25QdXNoXCJdID0gMF0gPSBcIk9uUHVzaFwiO1xuICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVtcIkRlZmF1bHRcIl0gPSAxXSA9IFwiRGVmYXVsdFwiO1xuICAgICAgICByZXR1cm4gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3k7XG4gICAgICB9KSh7fSk7XG4gICAgYDtcblxuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICBpdCgnd3JhcHMgdHMgMi4zIC0gMi42IGVudW1zIGluIElJRkUsIGV2ZW4gaWYgdGhleSBoYXZlIGZ1bm55IG51bWJlcnMnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgZXhwb3J0IHZhciBBbmltYXRvckNvbnRyb2xTdGF0ZTtcbiAgICAgIChmdW5jdGlvbiAoQW5pbWF0b3JDb250cm9sU3RhdGUpIHtcbiAgICAgICAgICBBbmltYXRvckNvbnRyb2xTdGF0ZVtBbmltYXRvckNvbnRyb2xTdGF0ZVtcIklOSVRJQUxJWkVEXCJdID0gMV0gPSBcIklOSVRJQUxJWkVEXCI7XG4gICAgICAgICAgQW5pbWF0b3JDb250cm9sU3RhdGVbQW5pbWF0b3JDb250cm9sU3RhdGVbXCJTVEFSVEVEXCJdID0gMl0gPSBcIlNUQVJURURcIjtcbiAgICAgICAgICBBbmltYXRvckNvbnRyb2xTdGF0ZVtBbmltYXRvckNvbnRyb2xTdGF0ZVtcIkZJTklTSEVEXCJdID0gM10gPSBcIkZJTklTSEVEXCI7XG4gICAgICAgICAgQW5pbWF0b3JDb250cm9sU3RhdGVbQW5pbWF0b3JDb250cm9sU3RhdGVbXCJERVNUUk9ZRURcIl0gPSA0XSA9IFwiREVTVFJPWUVEXCI7XG4gICAgICB9KShBbmltYXRvckNvbnRyb2xTdGF0ZSB8fCAoQW5pbWF0b3JDb250cm9sU3RhdGUgPSB7fSkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGV4cG9ydCB2YXIgQW5pbWF0b3JDb250cm9sU3RhdGUgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoQW5pbWF0b3JDb250cm9sU3RhdGUpIHtcbiAgICAgICAgICBBbmltYXRvckNvbnRyb2xTdGF0ZVtBbmltYXRvckNvbnRyb2xTdGF0ZVtcIklOSVRJQUxJWkVEXCJdID0gMV0gPSBcIklOSVRJQUxJWkVEXCI7XG4gICAgICAgICAgQW5pbWF0b3JDb250cm9sU3RhdGVbQW5pbWF0b3JDb250cm9sU3RhdGVbXCJTVEFSVEVEXCJdID0gMl0gPSBcIlNUQVJURURcIjtcbiAgICAgICAgICBBbmltYXRvckNvbnRyb2xTdGF0ZVtBbmltYXRvckNvbnRyb2xTdGF0ZVtcIkZJTklTSEVEXCJdID0gM10gPSBcIkZJTklTSEVEXCI7XG4gICAgICAgICAgQW5pbWF0b3JDb250cm9sU3RhdGVbQW5pbWF0b3JDb250cm9sU3RhdGVbXCJERVNUUk9ZRURcIl0gPSA0XSA9IFwiREVTVFJPWUVEXCI7XG4gICAgICAgICAgcmV0dXJuIEFuaW1hdG9yQ29udHJvbFN0YXRlO1xuICAgICAgfSkoe30pO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbiAgaXQoJ3dyYXBzIHRzaWNrbGUgZW51bXMgaW4gSUlGRScsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAvKiogQGVudW0ge251bWJlcn0gKi9cbiAgICAgIHZhciBGb3JtYXRXaWR0aCA9IHtcbiAgICAgICAgU2hvcnQ6IDAsXG4gICAgICAgIE1lZGl1bTogMSxcbiAgICAgICAgTG9uZzogMixcbiAgICAgICAgRnVsbDogMyxcbiAgICAgIH07XG4gICAgICBGb3JtYXRXaWR0aFtGb3JtYXRXaWR0aC5TaG9ydF0gPSBcIlNob3J0XCI7XG4gICAgICBGb3JtYXRXaWR0aFtGb3JtYXRXaWR0aC5NZWRpdW1dID0gXCJNZWRpdW1cIjtcbiAgICAgIEZvcm1hdFdpZHRoW0Zvcm1hdFdpZHRoLkxvbmddID0gXCJMb25nXCI7XG4gICAgICBGb3JtYXRXaWR0aFtGb3JtYXRXaWR0aC5GdWxsXSA9IFwiRnVsbFwiO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIC8qKiBAZW51bSB7bnVtYmVyfSAqLyB2YXIgRm9ybWF0V2lkdGggPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBGb3JtYXRXaWR0aCA9IHtcbiAgICAgICAgICBTaG9ydDogMCxcbiAgICAgICAgICBNZWRpdW06IDEsXG4gICAgICAgICAgTG9uZzogMixcbiAgICAgICAgICBGdWxsOiAzLFxuICAgICAgICB9O1xuICAgICAgICBGb3JtYXRXaWR0aFtGb3JtYXRXaWR0aC5TaG9ydF0gPSBcIlNob3J0XCI7XG4gICAgICAgIEZvcm1hdFdpZHRoW0Zvcm1hdFdpZHRoLk1lZGl1bV0gPSBcIk1lZGl1bVwiO1xuICAgICAgICBGb3JtYXRXaWR0aFtGb3JtYXRXaWR0aC5Mb25nXSA9IFwiTG9uZ1wiO1xuICAgICAgICBGb3JtYXRXaWR0aFtGb3JtYXRXaWR0aC5GdWxsXSA9IFwiRnVsbFwiO1xuICAgICAgICByZXR1cm4gRm9ybWF0V2lkdGg7XG4gICAgICB9KCkpO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbiAgaXQoJ3dyYXBzIGVudW1zIHdpdGggbXVsdGktbGluZSBjb21tZW50cyBpbiBJSUZFJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIC8qKlxuICAgICAgICogU3VwcG9ydGVkIGh0dHAgbWV0aG9kcy5cbiAgICAgICAqIEBkZXByZWNhdGVkIHVzZSBAYW5ndWxhci9jb21tb24vaHR0cCBpbnN0ZWFkXG4gICAgICAgKi9cbiAgICAgIHZhciBSZXF1ZXN0TWV0aG9kO1xuICAgICAgLyoqXG4gICAgICAgKiBTdXBwb3J0ZWQgaHR0cCBtZXRob2RzLlxuICAgICAgICogQGRlcHJlY2F0ZWQgdXNlIEBhbmd1bGFyL2NvbW1vbi9odHRwIGluc3RlYWRcbiAgICAgICAqL1xuICAgICAgKGZ1bmN0aW9uIChSZXF1ZXN0TWV0aG9kKSB7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiR2V0XCJdID0gMF0gPSBcIkdldFwiO1xuICAgICAgICAgIFJlcXVlc3RNZXRob2RbUmVxdWVzdE1ldGhvZFtcIlBvc3RcIl0gPSAxXSA9IFwiUG9zdFwiO1xuICAgICAgICAgIFJlcXVlc3RNZXRob2RbUmVxdWVzdE1ldGhvZFtcIlB1dFwiXSA9IDJdID0gXCJQdXRcIjtcbiAgICAgICAgICBSZXF1ZXN0TWV0aG9kW1JlcXVlc3RNZXRob2RbXCJEZWxldGVcIl0gPSAzXSA9IFwiRGVsZXRlXCI7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiT3B0aW9uc1wiXSA9IDRdID0gXCJPcHRpb25zXCI7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiSGVhZFwiXSA9IDVdID0gXCJIZWFkXCI7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiUGF0Y2hcIl0gPSA2XSA9IFwiUGF0Y2hcIjtcbiAgICAgIH0pKFJlcXVlc3RNZXRob2QgfHwgKFJlcXVlc3RNZXRob2QgPSB7fSkpO1xuICAgIGA7XG4gICAgLy8gV2UgbmVlZCB0byBpbnRlcnBvbGF0ZSB0aGlzIHNwYWNlIGJlY2F1c2Ugb3VyIGVkaXRvcmNvbmZpZyBhdXRvbWF0aWNhbGx5IHN0cmlwc1xuICAgIC8vIHRyYWlsaW5nIHdoaXRlc3BhY2UuXG4gICAgY29uc3Qgc3BhY2UgPSAnICc7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIC8qKlxuICAgICAgICogU3VwcG9ydGVkIGh0dHAgbWV0aG9kcy5cbiAgICAgICAqIEBkZXByZWNhdGVkIHVzZSBAYW5ndWxhci9jb21tb24vaHR0cCBpbnN0ZWFkXG4gICAgICAgKi9cbiAgICAgIHZhciBSZXF1ZXN0TWV0aG9kID0ke3NwYWNlfVxuICAgICAgIC8qKlxuICAgICAgICogU3VwcG9ydGVkIGh0dHAgbWV0aG9kcy5cbiAgICAgICAqIEBkZXByZWNhdGVkIHVzZSBAYW5ndWxhci9jb21tb24vaHR0cCBpbnN0ZWFkXG4gICAgICAgKi9cbiAgICAgIC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChSZXF1ZXN0TWV0aG9kKSB7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiR2V0XCJdID0gMF0gPSBcIkdldFwiO1xuICAgICAgICAgIFJlcXVlc3RNZXRob2RbUmVxdWVzdE1ldGhvZFtcIlBvc3RcIl0gPSAxXSA9IFwiUG9zdFwiO1xuICAgICAgICAgIFJlcXVlc3RNZXRob2RbUmVxdWVzdE1ldGhvZFtcIlB1dFwiXSA9IDJdID0gXCJQdXRcIjtcbiAgICAgICAgICBSZXF1ZXN0TWV0aG9kW1JlcXVlc3RNZXRob2RbXCJEZWxldGVcIl0gPSAzXSA9IFwiRGVsZXRlXCI7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiT3B0aW9uc1wiXSA9IDRdID0gXCJPcHRpb25zXCI7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiSGVhZFwiXSA9IDVdID0gXCJIZWFkXCI7XG4gICAgICAgICAgUmVxdWVzdE1ldGhvZFtSZXF1ZXN0TWV0aG9kW1wiUGF0Y2hcIl0gPSA2XSA9IFwiUGF0Y2hcIjtcbiAgICAgICAgICByZXR1cm4gUmVxdWVzdE1ldGhvZDtcbiAgICAgIH0pKHt9KTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCd3cmFwcyBleHBvcnRlZCBlbnVtcyBpbiBJSUZFJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBFeHBvcnRFbnVtO1xuICAgICAgKGZ1bmN0aW9uIChFeHBvcnRFbnVtKSB7XG4gICAgICAgIEV4cG9ydEVudW1bRXhwb3J0RW51bVtcIkFcIl0gPSAwXSA9IFwiQVwiO1xuICAgICAgICBFeHBvcnRFbnVtW0V4cG9ydEVudW1bXCJCXCJdID0gMV0gPSBcIkJcIjtcbiAgICAgICAgRXhwb3J0RW51bVtFeHBvcnRFbnVtW1wiQ1wiXSA9IDJdID0gXCJDXCI7XG4gICAgICB9KShFeHBvcnRFbnVtID0gZXhwb3J0cy5FeHBvcnRFbnVtIHx8IChleHBvcnRzLkV4cG9ydEVudW0gPSB7fSkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBFeHBvcnRFbnVtID0gZXhwb3J0cy5FeHBvcnRFbnVtID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKEV4cG9ydEVudW0pIHtcbiAgICAgICAgRXhwb3J0RW51bVtFeHBvcnRFbnVtW1wiQVwiXSA9IDBdID0gXCJBXCI7XG4gICAgICAgIEV4cG9ydEVudW1bRXhwb3J0RW51bVtcIkJcIl0gPSAxXSA9IFwiQlwiO1xuICAgICAgICBFeHBvcnRFbnVtW0V4cG9ydEVudW1bXCJDXCJdID0gMl0gPSBcIkNcIjtcbiAgICAgICAgcmV0dXJuIEV4cG9ydEVudW07XG4gICAgICB9KShleHBvcnRzLkV4cG9ydEVudW0gfHwge30pO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbn0pO1xuIl19