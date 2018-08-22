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
const import_tslib_1 = require("./import-tslib");
const transform = (content) => transform_javascript_1.transformJavascript({ content, getTransforms: [import_tslib_1.getImportTslibTransformer] }).content;
describe('import-tslib', () => {
    it('replaces __extends', () => {
        const input = core_1.tags.stripIndent `
      var __extends = (this && this.__extends) || function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    `;
        const output = core_1.tags.stripIndent `
      import { __extends } from "tslib";
    `;
        expect(import_tslib_1.testImportTslib(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('replaces __decorate', () => {
        // tslint:disable:max-line-length
        const input = core_1.tags.stripIndent `
      var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
          var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
      };
    `;
        // tslint:enable:max-line-length
        const output = core_1.tags.stripIndent `
      import { __decorate } from "tslib";
    `;
        expect(import_tslib_1.testImportTslib(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('replaces __metadata', () => {
        // tslint:disable:max-line-length
        const input = core_1.tags.stripIndent `
      var __metadata = (this && this.__metadata) || function (k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };
    `;
        // tslint:enable:max-line-length
        const output = core_1.tags.stripIndent `
      import { __metadata } from "tslib";
    `;
        expect(import_tslib_1.testImportTslib(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('replaces __param', () => {
        const input = core_1.tags.stripIndent `
      var __param = (this && this.__param) || function (paramIndex, decorator) {
          return function (target, key) { decorator(target, key, paramIndex); }
      };
    `;
        const output = core_1.tags.stripIndent `
      import { __param } from "tslib";
    `;
        expect(import_tslib_1.testImportTslib(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('replaces uses "require" instead of "import" on CJS modules', () => {
        const input = core_1.tags.stripIndent `
      var __extends = (this && this.__extends) || function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      exports.meaning = 42;
    `;
        const output = core_1.tags.stripIndent `
      var __extends = /*@__PURE__*/ require("tslib").__extends;
      exports.meaning = 42;
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('tests false for files using __webpack_require__', () => {
        const input = core_1.tags.stripIndent `
      function __webpack_require__(moduleId) {
          var __extends = (this && this.__extends) || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              function __() { this.constructor = d; }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
          exports.meaning = 42;
      }
    `;
        expect(import_tslib_1.testImportTslib(input)).toBeFalsy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXRzbGliX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvdHJhbnNmb3Jtcy9pbXBvcnQtdHNsaWJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILG9EQUFvRDtBQUNwRCwrQ0FBNEM7QUFDNUMsMEVBQXNFO0FBQ3RFLGlEQUE0RTtBQUc1RSxNQUFNLFNBQVMsR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQUMsMENBQW1CLENBQ3hELEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLHdDQUF5QixDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUVuRSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixFQUFFLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1FBQzVCLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7OztLQU03QixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7S0FFOUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyw4QkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUMsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsaUNBQWlDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7S0FPN0IsQ0FBQztRQUNGLGdDQUFnQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztLQUU5QixDQUFDO1FBRUYsTUFBTSxDQUFDLDhCQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QyxNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUM3QixpQ0FBaUM7UUFDakMsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7OztLQUk3QixDQUFDO1FBQ0YsZ0NBQWdDO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7O0tBRTlCLENBQUM7UUFFRixNQUFNLENBQUMsOEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7S0FJN0IsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7O0tBRTlCLENBQUM7UUFFRixNQUFNLENBQUMsOEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7S0FPN0IsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7OztLQUc5QixDQUFDO1FBRUYsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDekQsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7Ozs7O0tBUzdCLENBQUM7UUFFRixNQUFNLENBQUMsOEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyB0YWdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgdHJhbnNmb3JtSmF2YXNjcmlwdCB9IGZyb20gJy4uL2hlbHBlcnMvdHJhbnNmb3JtLWphdmFzY3JpcHQnO1xuaW1wb3J0IHsgZ2V0SW1wb3J0VHNsaWJUcmFuc2Zvcm1lciwgdGVzdEltcG9ydFRzbGliIH0gZnJvbSAnLi9pbXBvcnQtdHNsaWInO1xuXG5cbmNvbnN0IHRyYW5zZm9ybSA9IChjb250ZW50OiBzdHJpbmcpID0+IHRyYW5zZm9ybUphdmFzY3JpcHQoXG4gIHsgY29udGVudCwgZ2V0VHJhbnNmb3JtczogW2dldEltcG9ydFRzbGliVHJhbnNmb3JtZXJdIH0pLmNvbnRlbnQ7XG5cbmRlc2NyaWJlKCdpbXBvcnQtdHNsaWInLCAoKSA9PiB7XG4gIGl0KCdyZXBsYWNlcyBfX2V4dGVuZHMnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICAgIH07XG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG4gICAgYDtcblxuICAgIGV4cGVjdCh0ZXN0SW1wb3J0VHNsaWIoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdyZXBsYWNlcyBfX2RlY29yYXRlJywgKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICAgICAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgICAgICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICAgICAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xuICAgICAgfTtcbiAgICBgO1xuICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGltcG9ydCB7IF9fZGVjb3JhdGUgfSBmcm9tIFwidHNsaWJcIjtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RJbXBvcnRUc2xpYihpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbiAgaXQoJ3JlcGxhY2VzIF9fbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xuICAgICAgfTtcbiAgICBgO1xuICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGltcG9ydCB7IF9fbWV0YWRhdGEgfSBmcm9tIFwidHNsaWJcIjtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RJbXBvcnRUc2xpYihpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbiAgaXQoJ3JlcGxhY2VzIF9fcGFyYW0nLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbiAgICAgIH07XG4gICAgYDtcblxuICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICBpbXBvcnQgeyBfX3BhcmFtIH0gZnJvbSBcInRzbGliXCI7XG4gICAgYDtcblxuICAgIGV4cGVjdCh0ZXN0SW1wb3J0VHNsaWIoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdyZXBsYWNlcyB1c2VzIFwicmVxdWlyZVwiIGluc3RlYWQgb2YgXCJpbXBvcnRcIiBvbiBDSlMgbW9kdWxlcycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgICAgfTtcbiAgICAgIGV4cG9ydHMubWVhbmluZyA9IDQyO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBfX2V4dGVuZHMgPSAvKkBfX1BVUkVfXyovIHJlcXVpcmUoXCJ0c2xpYlwiKS5fX2V4dGVuZHM7XG4gICAgICBleHBvcnRzLm1lYW5pbmcgPSA0MjtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCd0ZXN0cyBmYWxzZSBmb3IgZmlsZXMgdXNpbmcgX193ZWJwYWNrX3JlcXVpcmVfXycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICBmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4gICAgICAgICAgdmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICAgICAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICAgICAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGV4cG9ydHMubWVhbmluZyA9IDQyO1xuICAgICAgfVxuICAgIGA7XG5cbiAgICBleHBlY3QodGVzdEltcG9ydFRzbGliKGlucHV0KSkudG9CZUZhbHN5KCk7XG4gIH0pO1xufSk7XG4iXX0=