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
const purify_1 = require("./purify");
// tslint:disable:max-line-length
describe('purify', () => {
    it('prefixes safe imports with /*@__PURE__*/', () => {
        const input = core_1.tags.stripIndent `
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("EEr4");
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(72);
      /** PURE_IMPORTS_START rxjs_Subject,_angular_http PURE_IMPORTS_END */
    `;
        const output = core_1.tags.stripIndent `
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = /*@__PURE__*/__webpack_require__("EEr4");
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = /*@__PURE__*/__webpack_require__(72);
      /** PURE_IMPORTS_START rxjs_Subject,_angular_http PURE_IMPORTS_END */
    `;
        expect(core_1.tags.oneLine `${purify_1.purify(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('prefixes safe default imports with /*@__PURE__*/', () => {
        const input = core_1.tags.stripIndent `
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__ = __webpack_require__("rlar");
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zone_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_zone_js__);
      /** PURE_IMPORTS_START rxjs_Subject,zone_js PURE_IMPORTS_END */
      `;
        const output = core_1.tags.stripIndent `
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__ = /*@__PURE__*/__webpack_require__("rlar");
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject___default = /*@__PURE__*/__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zone_js___default = /*@__PURE__*/__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_zone_js__);
      /** PURE_IMPORTS_START rxjs_Subject,zone_js PURE_IMPORTS_END */
      `;
        expect(core_1.tags.oneLine `${purify_1.purify(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    // Older versions of Purify added dots for relative imports. We should be backwards compatible.
    it('finds old matches that started with dots', () => {
        const input = core_1.tags.stripIndent `
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(13);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_toSubscriber__ = __webpack_require__(67);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__symbol_observable__ = __webpack_require__(45);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_pipe__ = __webpack_require__(71);
      /** PURE_IMPORTS_START ._util_root,._util_toSubscriber,.._symbol_observable,._util_pipe PURE_IMPORTS_END */
    `;
        const output = core_1.tags.stripIndent `
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = /*@__PURE__*/__webpack_require__(13);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_toSubscriber__ = /*@__PURE__*/__webpack_require__(67);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__symbol_observable__ = /*@__PURE__*/__webpack_require__(45);
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_pipe__ = /*@__PURE__*/__webpack_require__(71);
      /** PURE_IMPORTS_START ._util_root,._util_toSubscriber,.._symbol_observable,._util_pipe PURE_IMPORTS_END */
    `;
        expect(core_1.tags.oneLine `${purify_1.purify(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyaWZ5X3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvcHVyaWZ5L3B1cmlmeV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0RBQW9EO0FBQ3BELCtDQUE0QztBQUM1QyxxQ0FBa0M7QUFFbEMsaUNBQWlDO0FBQ2pDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7OztLQUk3QixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7OztLQUk5QixDQUFDO1FBRUYsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUMxRSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDMUQsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7T0FLM0IsQ0FBQztRQUNKLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7O09BSzVCLENBQUM7UUFFSixNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxDQUFDO0lBRUgsK0ZBQStGO0lBQy9GLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7O0tBTTdCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7S0FNOUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBwdXJpZnkgfSBmcm9tICcuL3B1cmlmeSc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuZGVzY3JpYmUoJ3B1cmlmeScsICgpID0+IHtcbiAgaXQoJ3ByZWZpeGVzIHNhZmUgaW1wb3J0cyB3aXRoIC8qQF9fUFVSRV9fKi8nLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9yeGpzX1N1YmplY3RfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCJFRXI0XCIpO1xuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fYW5ndWxhcl9odHRwX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcyKTtcbiAgICAgIC8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgcnhqc19TdWJqZWN0LF9hbmd1bGFyX2h0dHAgUFVSRV9JTVBPUlRTX0VORCAqL1xuICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIC8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfcnhqc19TdWJqZWN0X18gPSAvKkBfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyhcIkVFcjRcIik7XG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19hbmd1bGFyX2h0dHBfXyA9IC8qQF9fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDcyKTtcbiAgICAgIC8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgcnhqc19TdWJqZWN0LF9hbmd1bGFyX2h0dHAgUFVSRV9JTVBPUlRTX0VORCAqL1xuICAgIGA7XG5cbiAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cHVyaWZ5KGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgfSk7XG5cbiAgaXQoJ3ByZWZpeGVzIHNhZmUgZGVmYXVsdCBpbXBvcnRzIHdpdGggLypAX19QVVJFX18qLycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X3J4anNfU3ViamVjdF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcInJsYXJcIik7XG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X3J4anNfU3ViamVjdF9fX2RlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm4oX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X3J4anNfU3ViamVjdF9fKTtcbiAgICAgIC8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfem9uZV9qc19fX2RlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm4oX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX3pvbmVfanNfXyk7XG4gICAgICAvKiogUFVSRV9JTVBPUlRTX1NUQVJUIHJ4anNfU3ViamVjdCx6b25lX2pzIFBVUkVfSU1QT1JUU19FTkQgKi9cbiAgICAgIGA7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIC8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzRfcnhqc19TdWJqZWN0X18gPSAvKkBfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyhcInJsYXJcIik7XG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X3J4anNfU3ViamVjdF9fX2RlZmF1bHQgPSAvKkBfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXy5uKF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNF9yeGpzX1N1YmplY3RfXyk7XG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX3pvbmVfanNfX19kZWZhdWx0ID0gLypAX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18ubihfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfem9uZV9qc19fKTtcbiAgICAgIC8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgcnhqc19TdWJqZWN0LHpvbmVfanMgUFVSRV9JTVBPUlRTX0VORCAqL1xuICAgICAgYDtcblxuICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtwdXJpZnkoaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICB9KTtcblxuICAvLyBPbGRlciB2ZXJzaW9ucyBvZiBQdXJpZnkgYWRkZWQgZG90cyBmb3IgcmVsYXRpdmUgaW1wb3J0cy4gV2Ugc2hvdWxkIGJlIGJhY2t3YXJkcyBjb21wYXRpYmxlLlxuICBpdCgnZmluZHMgb2xkIG1hdGNoZXMgdGhhdCBzdGFydGVkIHdpdGggZG90cycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX191dGlsX3Jvb3RfXyA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpO1xuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fdXRpbF90b1N1YnNjcmliZXJfXyA9IF9fd2VicGFja19yZXF1aXJlX18oNjcpO1xuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fc3ltYm9sX29ic2VydmFibGVfXyA9IF9fd2VicGFja19yZXF1aXJlX18oNDUpO1xuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfM19fdXRpbF9waXBlX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcxKTtcbiAgICAgIC8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgLl91dGlsX3Jvb3QsLl91dGlsX3RvU3Vic2NyaWJlciwuLl9zeW1ib2xfb2JzZXJ2YWJsZSwuX3V0aWxfcGlwZSBQVVJFX0lNUE9SVFNfRU5EICovXG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fdXRpbF9yb290X18gPSAvKkBfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XG4gICAgICAvKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX191dGlsX3RvU3Vic2NyaWJlcl9fID0gLypAX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNjcpO1xuICAgICAgLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fc3ltYm9sX29ic2VydmFibGVfXyA9IC8qQF9fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDQ1KTtcbiAgICAgIC8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzNfX3V0aWxfcGlwZV9fID0gLypAX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzEpO1xuICAgICAgLyoqIFBVUkVfSU1QT1JUU19TVEFSVCAuX3V0aWxfcm9vdCwuX3V0aWxfdG9TdWJzY3JpYmVyLC4uX3N5bWJvbF9vYnNlcnZhYmxlLC5fdXRpbF9waXBlIFBVUkVfSU1QT1JUU19FTkQgKi9cbiAgICBgO1xuXG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3B1cmlmeShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xufSk7XG4iXX0=