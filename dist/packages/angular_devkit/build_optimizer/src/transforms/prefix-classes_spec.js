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
const transform_javascript_1 = require("../helpers/transform-javascript");
const prefix_classes_1 = require("./prefix-classes");
const transform = (content) => transform_javascript_1.transformJavascript({ content, getTransforms: [prefix_classes_1.getPrefixClassesTransformer] }).content;
describe('prefix-classes', () => {
    it('prefix TS 2.0 - 2.4 downlevel class', () => {
        const input = core_1.tags.stripIndent `
      var BasicTestCase = (function () {
        function BasicTestCase() {
        }
        return BasicTestCase;
      }());
    `;
        const output = core_1.tags.stripIndent `
      var BasicTestCase = /*@__PURE__*/ (function () {
        function BasicTestCase() {
        }
        return BasicTestCase;
      }());
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    // NOTE: TS 2.1+ uses a standalone export after the variable statement
    it('prefix TS 2.0 exported downlevel class with ES2015 modules', () => {
        const input = core_1.tags.stripIndent `
      export var OuterSubscriber = (function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            _super.apply(this, arguments);
        }
        return OuterSubscriber;
      }());
    `;
        const output = core_1.tags.stripIndent `
      export var OuterSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            _super.apply(this, arguments);
        }
        return OuterSubscriber;
      }());
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.0 downlevel class with extends', () => {
        const input = core_1.tags.stripIndent `
      var ExtendedClass = (function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            _super.apply(this, arguments);
        }
        return ExtendedClass;
      }(StaticTestCase));
    `;
        const output = core_1.tags.stripIndent `
      var ExtendedClass = /*@__PURE__*/ (function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            _super.apply(this, arguments);
        }
        return ExtendedClass;
      }(StaticTestCase));
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.1 - 2.3 downlevel class with static variable', () => {
        const input = core_1.tags.stripIndent `
      var StaticTestCase = (function () {
        function StaticTestCase() {
        }
        return StaticTestCase;
      }());
      StaticTestCase.StaticTest = true;
    `;
        const output = core_1.tags.stripIndent `
      var StaticTestCase = /*@__PURE__*/ (function () {
        function StaticTestCase() {
        }
        return StaticTestCase;
      }());
      StaticTestCase.StaticTest = true;
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.1 - 2.4 downlevel class with extends', () => {
        const input = core_1.tags.stripIndent `
      var ExtendedClass = (function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedClass;
      }(StaticTestCase));
    `;
        const output = core_1.tags.stripIndent `
      var ExtendedClass = /*@__PURE__*/ (function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedClass;
      }(StaticTestCase));
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.0 & 2.4 downlevel class with static variable', () => {
        const input = core_1.tags.stripIndent `
      var StaticTestCase = (function () {
        function StaticTestCase() {
        }
        StaticTestCase.StaticTest = true;
        return StaticTestCase;
      }());
    `;
        const output = core_1.tags.stripIndent `
      var StaticTestCase = /*@__PURE__*/ (function () {
        function StaticTestCase() {
        }
        StaticTestCase.StaticTest = true;
        return StaticTestCase;
      }());
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.5 - 2.6 downlevel class', () => {
        const input = core_1.tags.stripIndent `
      var BasicTestCase = /** @class */ (function () {
        function BasicTestCase() {
        }
        return BasicTestCase;
      }());
    `;
        const output = core_1.tags.stripIndent `
      var BasicTestCase = /** @class */ /*@__PURE__*/ (function () {
        function BasicTestCase() {
        }
        return BasicTestCase;
      }());
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.5 - 2.6 downlevel class with static variable', () => {
        const input = core_1.tags.stripIndent `
      var StaticTestCase = /** @class */ (function () {
        function StaticTestCase() {
        }
        StaticTestCase.StaticTest = true;
        return StaticTestCase;
      }());
    `;
        const output = core_1.tags.stripIndent `
      var StaticTestCase = /** @class */ /*@__PURE__*/ (function () {
        function StaticTestCase() {
        }
        StaticTestCase.StaticTest = true;
        return StaticTestCase;
      }());
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefix TS 2.5 - 2.6 downlevel class with extends', () => {
        const input = core_1.tags.stripIndent `
      var ExtendedClass = /** @class */ (function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedClass;
      }(StaticTestCase));
    `;
        const output = core_1.tags.stripIndent `
      var ExtendedClass = /** @class */ /*@__PURE__*/ (function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedClass;
      }(StaticTestCase));
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('works with tslib namespace import', () => {
        const input = core_1.tags.stripIndent `
      var BufferSubscriber = /** @class */ (function (_super) {
        tslib_1.__extends(BufferSubscriber, _super);
        function BufferSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return BufferSubscriber;
      }(OuterSubscriber));
    `;
        const output = core_1.tags.stripIndent `
      var BufferSubscriber = /** @class */ /*@__PURE__*/ (function (_super) {
        tslib_1.__extends(BufferSubscriber, _super);
        function BufferSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return BufferSubscriber;
      }(OuterSubscriber));
    `;
        expect(prefix_classes_1.testPrefixClasses(input)).toBeTruthy();
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('fixes the RxJS use case (issue #214)', () => {
        const input = `
      var ExtendedClass = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedClass;
      }(StaticTestCase));

      /**
       * We need this JSDoc comment for affecting ESDoc.
       * @ignore
       * @extends {Ignored}
       */
      var zip_ZipSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
          zip___extends(ZipSubscriber, _super);
          function ZipSubscriber(destination, project, values) {
              if (values === void 0) {
                  values = Object.create(null);
              }
              _super.call(this, destination);
              this.iterators = [];
              this.active = 0;
              this.project = (typeof project === 'function') ? project : null;
              this.values = values;
          }
          return ZipSubscriber;
      }(Subscriber));
    `;
        const output = `
      var ExtendedClass = /*@__PURE__*/ /*@__PURE__*/ ( /*@__PURE__*/function (_super) {
        __extends(ExtendedClass, _super);
        function ExtendedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedClass;
      }(StaticTestCase));

      /**
       * We need this JSDoc comment for affecting ESDoc.
       * @ignore
       * @extends {Ignored}
       */
      var zip_ZipSubscriber = /*@__PURE__*/ /*@__PURE__*/ ( /*@__PURE__*/function (_super) {
          zip___extends(ZipSubscriber, _super);
          function ZipSubscriber(destination, project, values) {
              if (values === void 0) {
                  values = Object.create(null);
              }
              _super.call(this, destination);
              this.iterators = [];
              this.active = 0;
              this.project = (typeof project === 'function') ? project : null;
              this.values = values;
          }
          return ZipSubscriber;
      }(Subscriber));
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWNsYXNzZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy90cmFuc2Zvcm1zL3ByZWZpeC1jbGFzc2VzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFDakMsb0RBQW9EO0FBQ3BELCtDQUE0QztBQUM1QywwRUFBc0U7QUFDdEUscURBQWtGO0FBR2xGLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQywwQ0FBbUIsQ0FDeEQsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsNENBQTJCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBRXJFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7S0FNN0IsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7OztLQU05QixDQUFDO1FBRUYsTUFBTSxDQUFDLGtDQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUMsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztJQUVILHNFQUFzRTtJQUN0RSxFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FB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KiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1KYXZhc2NyaXB0IH0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbGFzc2VzVHJhbnNmb3JtZXIsIHRlc3RQcmVmaXhDbGFzc2VzIH0gZnJvbSAnLi9wcmVmaXgtY2xhc3Nlcyc7XG5cblxuY29uc3QgdHJhbnNmb3JtID0gKGNvbnRlbnQ6IHN0cmluZykgPT4gdHJhbnNmb3JtSmF2YXNjcmlwdChcbiAgeyBjb250ZW50LCBnZXRUcmFuc2Zvcm1zOiBbZ2V0UHJlZml4Q2xhc3Nlc1RyYW5zZm9ybWVyXSB9KS5jb250ZW50O1xuXG5kZXNjcmliZSgncHJlZml4LWNsYXNzZXMnLCAoKSA9PiB7XG4gIGl0KCdwcmVmaXggVFMgMi4wIC0gMi40IGRvd25sZXZlbCBjbGFzcycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgQmFzaWNUZXN0Q2FzZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEJhc2ljVGVzdENhc2UoKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJhc2ljVGVzdENhc2U7XG4gICAgICB9KCkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBCYXNpY1Rlc3RDYXNlID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBCYXNpY1Rlc3RDYXNlKCkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBCYXNpY1Rlc3RDYXNlO1xuICAgICAgfSgpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RQcmVmaXhDbGFzc2VzKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICAvLyBOT1RFOiBUUyAyLjErIHVzZXMgYSBzdGFuZGFsb25lIGV4cG9ydCBhZnRlciB0aGUgdmFyaWFibGUgc3RhdGVtZW50XG4gIGl0KCdwcmVmaXggVFMgMi4wIGV4cG9ydGVkIGRvd25sZXZlbCBjbGFzcyB3aXRoIEVTMjAxNSBtb2R1bGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIGV4cG9ydCB2YXIgT3V0ZXJTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKE91dGVyU3Vic2NyaWJlciwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gT3V0ZXJTdWJzY3JpYmVyKCkge1xuICAgICAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE91dGVyU3Vic2NyaWJlcjtcbiAgICAgIH0oKSk7XG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgZXhwb3J0IHZhciBPdXRlclN1YnNjcmliZXIgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhPdXRlclN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIE91dGVyU3Vic2NyaWJlcigpIHtcbiAgICAgICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPdXRlclN1YnNjcmliZXI7XG4gICAgICB9KCkpO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGVzdFByZWZpeENsYXNzZXMoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdwcmVmaXggVFMgMi4wIGRvd25sZXZlbCBjbGFzcyB3aXRoIGV4dGVuZHMnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIEV4dGVuZGVkQ2xhc3MgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFeHRlbmRlZENsYXNzO1xuICAgICAgfShTdGF0aWNUZXN0Q2FzZSkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBFeHRlbmRlZENsYXNzID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFeHRlbmRlZENsYXNzO1xuICAgICAgfShTdGF0aWNUZXN0Q2FzZSkpO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGVzdFByZWZpeENsYXNzZXMoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdwcmVmaXggVFMgMi4xIC0gMi4zIGRvd25sZXZlbCBjbGFzcyB3aXRoIHN0YXRpYyB2YXJpYWJsZScsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgU3RhdGljVGVzdENhc2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBTdGF0aWNUZXN0Q2FzZSgpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RhdGljVGVzdENhc2U7XG4gICAgICB9KCkpO1xuICAgICAgU3RhdGljVGVzdENhc2UuU3RhdGljVGVzdCA9IHRydWU7XG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIFN0YXRpY1Rlc3RDYXNlID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBTdGF0aWNUZXN0Q2FzZSgpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RhdGljVGVzdENhc2U7XG4gICAgICB9KCkpO1xuICAgICAgU3RhdGljVGVzdENhc2UuU3RhdGljVGVzdCA9IHRydWU7XG4gICAgYDtcblxuICAgIGV4cGVjdCh0ZXN0UHJlZml4Q2xhc3NlcyhpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbiAgaXQoJ3ByZWZpeCBUUyAyLjEgLSAyLjQgZG93bmxldmVsIGNsYXNzIHdpdGggZXh0ZW5kcycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgRXh0ZW5kZWRDbGFzcyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhFeHRlbmRlZENsYXNzLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBFeHRlbmRlZENsYXNzKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFeHRlbmRlZENsYXNzO1xuICAgICAgfShTdGF0aWNUZXN0Q2FzZSkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBFeHRlbmRlZENsYXNzID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRXh0ZW5kZWRDbGFzcztcbiAgICAgIH0oU3RhdGljVGVzdENhc2UpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RQcmVmaXhDbGFzc2VzKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICBpdCgncHJlZml4IFRTIDIuMCAmIDIuNCBkb3dubGV2ZWwgY2xhc3Mgd2l0aCBzdGF0aWMgdmFyaWFibGUnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIFN0YXRpY1Rlc3RDYXNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gU3RhdGljVGVzdENhc2UoKSB7XG4gICAgICAgIH1cbiAgICAgICAgU3RhdGljVGVzdENhc2UuU3RhdGljVGVzdCA9IHRydWU7XG4gICAgICAgIHJldHVybiBTdGF0aWNUZXN0Q2FzZTtcbiAgICAgIH0oKSk7XG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIFN0YXRpY1Rlc3RDYXNlID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBTdGF0aWNUZXN0Q2FzZSgpIHtcbiAgICAgICAgfVxuICAgICAgICBTdGF0aWNUZXN0Q2FzZS5TdGF0aWNUZXN0ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIFN0YXRpY1Rlc3RDYXNlO1xuICAgICAgfSgpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RQcmVmaXhDbGFzc2VzKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICBpdCgncHJlZml4IFRTIDIuNSAtIDIuNiBkb3dubGV2ZWwgY2xhc3MnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIEJhc2ljVGVzdENhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEJhc2ljVGVzdENhc2UoKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJhc2ljVGVzdENhc2U7XG4gICAgICB9KCkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBCYXNpY1Rlc3RDYXNlID0gLyoqIEBjbGFzcyAqLyAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEJhc2ljVGVzdENhc2UoKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJhc2ljVGVzdENhc2U7XG4gICAgICB9KCkpO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGVzdFByZWZpeENsYXNzZXMoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdwcmVmaXggVFMgMi41IC0gMi42IGRvd25sZXZlbCBjbGFzcyB3aXRoIHN0YXRpYyB2YXJpYWJsZScsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgU3RhdGljVGVzdENhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFN0YXRpY1Rlc3RDYXNlKCkge1xuICAgICAgICB9XG4gICAgICAgIFN0YXRpY1Rlc3RDYXNlLlN0YXRpY1Rlc3QgPSB0cnVlO1xuICAgICAgICByZXR1cm4gU3RhdGljVGVzdENhc2U7XG4gICAgICB9KCkpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBTdGF0aWNUZXN0Q2FzZSA9IC8qKiBAY2xhc3MgKi8gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBTdGF0aWNUZXN0Q2FzZSgpIHtcbiAgICAgICAgfVxuICAgICAgICBTdGF0aWNUZXN0Q2FzZS5TdGF0aWNUZXN0ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIFN0YXRpY1Rlc3RDYXNlO1xuICAgICAgfSgpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RQcmVmaXhDbGFzc2VzKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICBpdCgncHJlZml4IFRTIDIuNSAtIDIuNiBkb3dubGV2ZWwgY2xhc3Mgd2l0aCBleHRlbmRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBFeHRlbmRlZENsYXNzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRXh0ZW5kZWRDbGFzcztcbiAgICAgIH0oU3RhdGljVGVzdENhc2UpKTtcbiAgICBgO1xuICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgRXh0ZW5kZWRDbGFzcyA9IC8qKiBAY2xhc3MgKi8gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRXh0ZW5kZWRDbGFzcztcbiAgICAgIH0oU3RhdGljVGVzdENhc2UpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRlc3RQcmVmaXhDbGFzc2VzKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICBpdCgnd29ya3Mgd2l0aCB0c2xpYiBuYW1lc3BhY2UgaW1wb3J0JywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBCdWZmZXJTdWJzY3JpYmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhCdWZmZXJTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBCdWZmZXJTdWJzY3JpYmVyKCkge1xuICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQnVmZmVyU3Vic2NyaWJlcjtcbiAgICAgIH0oT3V0ZXJTdWJzY3JpYmVyKSk7XG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIEJ1ZmZlclN1YnNjcmliZXIgPSAvKiogQGNsYXNzICovIC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoQnVmZmVyU3Vic2NyaWJlciwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQnVmZmVyU3Vic2NyaWJlcigpIHtcbiAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJ1ZmZlclN1YnNjcmliZXI7XG4gICAgICB9KE91dGVyU3Vic2NyaWJlcikpO1xuICAgIGA7XG5cbiAgICBleHBlY3QodGVzdFByZWZpeENsYXNzZXMoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdmaXhlcyB0aGUgUnhKUyB1c2UgY2FzZSAoaXNzdWUgIzIxNCknLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBgXG4gICAgICB2YXIgRXh0ZW5kZWRDbGFzcyA9IC8qQF9fUFVSRV9fKi8gKC8qQF9fUFVSRV9fKi8gZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRXh0ZW5kZWRDbGFzcztcbiAgICAgIH0oU3RhdGljVGVzdENhc2UpKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICAgICAgICogQGlnbm9yZVxuICAgICAgICogQGV4dGVuZHMge0lnbm9yZWR9XG4gICAgICAgKi9cbiAgICAgIHZhciB6aXBfWmlwU3Vic2NyaWJlciA9IC8qQF9fUFVSRV9fKi8gKC8qQF9fUFVSRV9fKi8gZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICAgIHppcF9fX2V4dGVuZHMoWmlwU3Vic2NyaWJlciwgX3N1cGVyKTtcbiAgICAgICAgICBmdW5jdGlvbiBaaXBTdWJzY3JpYmVyKGRlc3RpbmF0aW9uLCBwcm9qZWN0LCB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlcyA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvcnMgPSBbXTtcbiAgICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSAwO1xuICAgICAgICAgICAgICB0aGlzLnByb2plY3QgPSAodHlwZW9mIHByb2plY3QgPT09ICdmdW5jdGlvbicpID8gcHJvamVjdCA6IG51bGw7XG4gICAgICAgICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gWmlwU3Vic2NyaWJlcjtcbiAgICAgIH0oU3Vic2NyaWJlcikpO1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gYFxuICAgICAgdmFyIEV4dGVuZGVkQ2xhc3MgPSAvKkBfX1BVUkVfXyovIC8qQF9fUFVSRV9fKi8gKCAvKkBfX1BVUkVfXyovZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRXh0ZW5kZWRDbGFzcywgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRXh0ZW5kZWRDbGFzcygpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRXh0ZW5kZWRDbGFzcztcbiAgICAgIH0oU3RhdGljVGVzdENhc2UpKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICAgICAgICogQGlnbm9yZVxuICAgICAgICogQGV4dGVuZHMge0lnbm9yZWR9XG4gICAgICAgKi9cbiAgICAgIHZhciB6aXBfWmlwU3Vic2NyaWJlciA9IC8qQF9fUFVSRV9fKi8gLypAX19QVVJFX18qLyAoIC8qQF9fUFVSRV9fKi9mdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgICAgemlwX19fZXh0ZW5kcyhaaXBTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgICAgICAgIGZ1bmN0aW9uIFppcFN1YnNjcmliZXIoZGVzdGluYXRpb24sIHByb2plY3QsIHZhbHVlcykge1xuICAgICAgICAgICAgICBpZiAodmFsdWVzID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9ycyA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IDA7XG4gICAgICAgICAgICAgIHRoaXMucHJvamVjdCA9ICh0eXBlb2YgcHJvamVjdCA9PT0gJ2Z1bmN0aW9uJykgPyBwcm9qZWN0IDogbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBaaXBTdWJzY3JpYmVyO1xuICAgICAgfShTdWJzY3JpYmVyKSk7XG4gICAgYDtcbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG59KTtcbiJdfQ==