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
const register_locale_data_1 = require("./register_locale_data");
describe('@ngtools/webpack transformers', () => {
    describe('register_locale_data', () => {
        it('should add locale imports', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        platformBrowserDynamic().bootstrapModule(AppModule);
      `;
            const output = core_1.tags.stripIndent `
        import * as __NgCli_locale_1 from "@angular/common/locales/fr";
        import * as __NgCli_locale_2 from "@angular/common";
        __NgCli_locale_2.registerLocaleData(__NgCli_locale_1.default);

        import { enableProdMode } from '@angular/core';
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
            enableProdMode();
        }

        platformBrowserDynamic().bootstrapModule(AppModule);
      `;
            const transformer = register_locale_data_1.registerLocaleData(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]), 'fr');
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should not add locale imports when there is no entry module', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        platformBrowserDynamic().bootstrapModule(AppModule);
      `;
            const transformer = register_locale_data_1.registerLocaleData(() => true, () => null, 'fr');
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${input}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJfbG9jYWxlX2RhdGFfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvbmd0b29scy93ZWJwYWNrL3NyYy90cmFuc2Zvcm1lcnMvcmVnaXN0ZXJfbG9jYWxlX2RhdGFfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUE0QyxDQUFFLCtDQUErQztBQUM3RiwrQ0FBb0Q7QUFDcEQsaUVBQTREO0FBRTVELFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7SUFDN0MsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7Ozs7OztPQVk3QixDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7OztPQWdCOUIsQ0FBQztZQUVGLE1BQU0sV0FBVyxHQUFHLHlDQUFrQixDQUNwQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQ3pFLElBQUksQ0FDTCxDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsaUNBQW1CLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUV6RCxNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7T0FZN0IsQ0FBQztZQUVGLE1BQU0sV0FBVyxHQUFHLHlDQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckUsTUFBTSxNQUFNLEdBQUcsaUNBQW1CLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUV6RCxNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7ICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgdHJhbnNmb3JtVHlwZXNjcmlwdCB9IGZyb20gJy4vYXN0X2hlbHBlcnMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJMb2NhbGVEYXRhIH0gZnJvbSAnLi9yZWdpc3Rlcl9sb2NhbGVfZGF0YSc7XG5cbmRlc2NyaWJlKCdAbmd0b29scy93ZWJwYWNrIHRyYW5zZm9ybWVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3JlZ2lzdGVyX2xvY2FsZV9kYXRhJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWRkIGxvY2FsZSBpbXBvcnRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhdGZvcm1Ccm93c2VyRHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCAqIGFzIF9fTmdDbGlfbG9jYWxlXzEgZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9sb2NhbGVzL2ZyXCI7XG4gICAgICAgIGltcG9ydCAqIGFzIF9fTmdDbGlfbG9jYWxlXzIgZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuICAgICAgICBfX05nQ2xpX2xvY2FsZV8yLnJlZ2lzdGVyTG9jYWxlRGF0YShfX05nQ2xpX2xvY2FsZV8xLmRlZmF1bHQpO1xuXG4gICAgICAgIGltcG9ydCB7IGVuYWJsZVByb2RNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IHBsYXRmb3JtQnJvd3NlckR5bmFtaWMgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMnO1xuXG4gICAgICAgIGltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gJy4vYXBwL2FwcC5tb2R1bGUnO1xuICAgICAgICBpbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcblxuICAgICAgICBpZiAoZW52aXJvbm1lbnQucHJvZHVjdGlvbikge1xuICAgICAgICAgICAgZW5hYmxlUHJvZE1vZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXRmb3JtQnJvd3NlckR5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcmVnaXN0ZXJMb2NhbGVEYXRhKFxuICAgICAgICAoKSA9PiB0cnVlLFxuICAgICAgICAoKSA9PiAoW3sgcGF0aDogJy9wcm9qZWN0L3NyYy9hcHAvYXBwLm1vZHVsZScsIGNsYXNzTmFtZTogJ0FwcE1vZHVsZScgfV0pLFxuICAgICAgICAnZnInLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQoaW5wdXQsIFt0cmFuc2Zvcm1lcl0pO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgYWRkIGxvY2FsZSBpbXBvcnRzIHdoZW4gdGhlcmUgaXMgbm8gZW50cnkgbW9kdWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhdGZvcm1Ccm93c2VyRHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xuICAgICAgYDtcblxuICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSByZWdpc3RlckxvY2FsZURhdGEoKCkgPT4gdHJ1ZSwgKCkgPT4gbnVsbCwgJ2ZyJyk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KGlucHV0LCBbdHJhbnNmb3JtZXJdKTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke2lucHV0fWApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19