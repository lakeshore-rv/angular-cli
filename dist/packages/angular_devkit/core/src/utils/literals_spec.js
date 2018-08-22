"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const literals_1 = require("./literals");
describe('literals', () => {
    describe('stripIndent', () => {
        it('works', () => {
            const test = literals_1.stripIndent `
        hello world
          how are you?
        test
      `;
            expect(test).toBe('hello world\n  how are you?\ntest');
        });
    });
    describe('stripIndents', () => {
        it('works', () => {
            const test = literals_1.stripIndents `
        hello world
          how are you?
        test
      `;
            expect(test).toBe('hello world\nhow are you?\ntest');
        });
    });
    describe('oneLine', () => {
        it('works', () => {
            const test = literals_1.oneLine `
        hello world
          how are you?  blue  red
        test
      `;
            expect(test).toBe('hello world how are you?  blue  red test');
        });
    });
    describe('trimNewlines', () => {
        it('works', () => {
            const test = literals_1.trimNewlines `
        hello world
      `;
            expect(test).toBe('        hello world');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl0ZXJhbHNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvdXRpbHMvbGl0ZXJhbHNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHlDQUE4RTtBQUU5RSxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNmLE1BQU0sSUFBSSxHQUFHLHNCQUFXLENBQUE7Ozs7T0FJdkIsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDZixNQUFNLElBQUksR0FBRyx1QkFBWSxDQUFBOzs7O09BSXhCLENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ2YsTUFBTSxJQUFJLEdBQUcsa0JBQU8sQ0FBQTs7OztPQUluQixDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNmLE1BQU0sSUFBSSxHQUFHLHVCQUFZLENBQUE7O09BRXhCLENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgb25lTGluZSwgc3RyaXBJbmRlbnQsIHN0cmlwSW5kZW50cywgdHJpbU5ld2xpbmVzIH0gZnJvbSAnLi9saXRlcmFscyc7XG5cbmRlc2NyaWJlKCdsaXRlcmFscycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3N0cmlwSW5kZW50JywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3QgPSBzdHJpcEluZGVudGBcbiAgICAgICAgaGVsbG8gd29ybGRcbiAgICAgICAgICBob3cgYXJlIHlvdT9cbiAgICAgICAgdGVzdFxuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRlc3QpLnRvQmUoJ2hlbGxvIHdvcmxkXFxuICBob3cgYXJlIHlvdT9cXG50ZXN0Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdHJpcEluZGVudHMnLCAoKSA9PiB7XG4gICAgaXQoJ3dvcmtzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdGVzdCA9IHN0cmlwSW5kZW50c2BcbiAgICAgICAgaGVsbG8gd29ybGRcbiAgICAgICAgICBob3cgYXJlIHlvdT9cbiAgICAgICAgdGVzdFxuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRlc3QpLnRvQmUoJ2hlbGxvIHdvcmxkXFxuaG93IGFyZSB5b3U/XFxudGVzdCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnb25lTGluZScsICgpID0+IHtcbiAgICBpdCgnd29ya3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ZXN0ID0gb25lTGluZWBcbiAgICAgICAgaGVsbG8gd29ybGRcbiAgICAgICAgICBob3cgYXJlIHlvdT8gIGJsdWUgIHJlZFxuICAgICAgICB0ZXN0XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdCkudG9CZSgnaGVsbG8gd29ybGQgaG93IGFyZSB5b3U/ICBibHVlICByZWQgdGVzdCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndHJpbU5ld2xpbmVzJywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3QgPSB0cmltTmV3bGluZXNgXG4gICAgICAgIGhlbGxvIHdvcmxkXG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdCkudG9CZSgnICAgICAgICBoZWxsbyB3b3JsZCcpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19