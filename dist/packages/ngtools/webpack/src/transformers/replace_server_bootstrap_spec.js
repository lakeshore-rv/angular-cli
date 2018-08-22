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
const core_1 = require("@angular-devkit/core"); // tslint:disable-line:no-implicit-dependencies
const ast_helpers_1 = require("./ast_helpers");
const replace_server_bootstrap_1 = require("./replace_server_bootstrap");
describe('@ngtools/webpack transformers', () => {
    describe('replace_server_bootstrap', () => {
        it('should replace bootstrap', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { platformDynamicServer } from '@angular/platform-server';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        platformDynamicServer().bootstrapModule(AppModule);
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { environment } from './environments/environment';

        import * as __NgCli_bootstrap_1 from "./app/app.module.ngfactory";
        import * as __NgCli_bootstrap_2 from "@angular/platform-server";

        if (environment.production) {
          enableProdMode();
        }
        __NgCli_bootstrap_2.platformServer().bootstrapModuleFactory(__NgCli_bootstrap_1.AppModuleNgFactory);
      `;
            // tslint:enable:max-line-length
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = replace_server_bootstrap_1.replaceServerBootstrap(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]), () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should replace renderModule', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { renderModule } from '@angular/platform-server';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        renderModule(AppModule, {
          document: '<app-root></app-root>',
          url: '/'
        });
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { environment } from './environments/environment';

        import * as __NgCli_bootstrap_1 from "./app/app.module.ngfactory";
        import * as __NgCli_bootstrap_2 from "@angular/platform-server";

        if (environment.production) {
          enableProdMode();
        }
        __NgCli_bootstrap_2.renderModuleFactory(__NgCli_bootstrap_1.AppModuleNgFactory, {
            document: '<app-root></app-root>',
            url: '/'
          });
      `;
            // tslint:enable:max-line-length
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = replace_server_bootstrap_1.replaceServerBootstrap(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]), () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should replace when the module is used in a config object', () => {
            const input = core_1.tags.stripIndent `
        import * as express from 'express';

        import { enableProdMode } from '@angular/core';
        import { ngExpressEngine } from '@nguniversal/express-engine';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        const server = express();
        server.engine('html', ngExpressEngine({
          bootstrap: AppModule
        }));
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.stripIndent `
        import * as express from 'express';

        import { enableProdMode } from '@angular/core';
        import { ngExpressEngine } from '@nguniversal/express-engine';

        import { environment } from './environments/environment';

        import * as __NgCli_bootstrap_1 from "./app/app.module.ngfactory";

        if (environment.production) {
          enableProdMode();
        }

        const server = express();
        server.engine('html', ngExpressEngine({
          bootstrap: __NgCli_bootstrap_1.AppModuleNgFactory
        }));
      `;
            // tslint:enable:max-line-length
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = replace_server_bootstrap_1.replaceServerBootstrap(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]), () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should replace bootstrap when barrel files are used', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { platformDynamicServer } from '@angular/platform-browser-dynamic';

        import { AppModule } from './app';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        platformDynamicServer().bootstrapModule(AppModule);
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { environment } from './environments/environment';

        import * as __NgCli_bootstrap_1 from "./app/app.module.ngfactory";
        import * as __NgCli_bootstrap_2 from "@angular/platform-server";

        if (environment.production) {
          enableProdMode();
        }
        __NgCli_bootstrap_2.platformServer().bootstrapModuleFactory(__NgCli_bootstrap_1.AppModuleNgFactory);
      `;
            // tslint:enable:max-line-length
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = replace_server_bootstrap_1.replaceServerBootstrap(() => true, () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]), () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should not replace bootstrap when there is no entry module', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { platformDynamicServer } from '@angular/platform-browser-dynamic';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        platformDynamicServer().bootstrapModule(AppModule);
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = replace_server_bootstrap_1.replaceServerBootstrap(() => true, () => null, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${input}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZV9zZXJ2ZXJfYm9vdHN0cmFwX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL25ndG9vbHMvd2VicGFjay9zcmMvdHJhbnNmb3JtZXJzL3JlcGxhY2Vfc2VydmVyX2Jvb3RzdHJhcF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWlDO0FBQ2pDLCtDQUE0QyxDQUFFLCtDQUErQztBQUM3RiwrQ0FBNkU7QUFDN0UseUVBQW9FO0FBRXBFLFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7SUFDN0MsUUFBUSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUN4QyxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7Ozs7OztPQVk3QixDQUFDO1lBRUYsaUNBQWlDO1lBQ2pDLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7Ozs7O09BVzlCLENBQUM7WUFDRixnQ0FBZ0M7WUFFaEMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsR0FBRyxxQ0FBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqRSxNQUFNLFdBQVcsR0FBRyxpREFBc0IsQ0FDeEMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSw2QkFBNkIsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUN6RSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQy9CLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxpQ0FBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxD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SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8tYmlnLWZ1bmN0aW9uXG5pbXBvcnQgeyB0YWdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnOyAgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IGNyZWF0ZVR5cGVzY3JpcHRDb250ZXh0LCB0cmFuc2Zvcm1UeXBlc2NyaXB0IH0gZnJvbSAnLi9hc3RfaGVscGVycyc7XG5pbXBvcnQgeyByZXBsYWNlU2VydmVyQm9vdHN0cmFwIH0gZnJvbSAnLi9yZXBsYWNlX3NlcnZlcl9ib290c3RyYXAnO1xuXG5kZXNjcmliZSgnQG5ndG9vbHMvd2VicGFjayB0cmFuc2Zvcm1lcnMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdyZXBsYWNlX3NlcnZlcl9ib290c3RyYXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIGJvb3RzdHJhcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgcGxhdGZvcm1EeW5hbWljU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhdGZvcm1EeW5hbWljU2VydmVyKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XG4gICAgICBgO1xuXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IGVuYWJsZVByb2RNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG4gICAgICAgIGltcG9ydCAqIGFzIF9fTmdDbGlfYm9vdHN0cmFwXzEgZnJvbSBcIi4vYXBwL2FwcC5tb2R1bGUubmdmYWN0b3J5XCI7XG4gICAgICAgIGltcG9ydCAqIGFzIF9fTmdDbGlfYm9vdHN0cmFwXzIgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLXNlcnZlclwiO1xuXG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5wcm9kdWN0aW9uKSB7XG4gICAgICAgICAgZW5hYmxlUHJvZE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBfX05nQ2xpX2Jvb3RzdHJhcF8yLnBsYXRmb3JtU2VydmVyKCkuYm9vdHN0cmFwTW9kdWxlRmFjdG9yeShfX05nQ2xpX2Jvb3RzdHJhcF8xLkFwcE1vZHVsZU5nRmFjdG9yeSk7XG4gICAgICBgO1xuICAgICAgLy8gdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGhcblxuICAgICAgY29uc3QgeyBwcm9ncmFtLCBjb21waWxlckhvc3QgfSA9IGNyZWF0ZVR5cGVzY3JpcHRDb250ZXh0KGlucHV0KTtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcmVwbGFjZVNlcnZlckJvb3RzdHJhcChcbiAgICAgICAgKCkgPT4gdHJ1ZSxcbiAgICAgICAgKCkgPT4gKFt7IHBhdGg6ICcvcHJvamVjdC9zcmMvYXBwL2FwcC5tb2R1bGUnLCBjbGFzc05hbWU6ICdBcHBNb2R1bGUnIH1dKSxcbiAgICAgICAgKCkgPT4gcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQodW5kZWZpbmVkLCBbdHJhbnNmb3JtZXJdLCBwcm9ncmFtLCBjb21waWxlckhvc3QpO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIHJlbmRlck1vZHVsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgcmVuZGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyTW9kdWxlKEFwcE1vZHVsZSwge1xuICAgICAgICAgIGRvY3VtZW50OiAnPGFwcC1yb290PjwvYXBwLXJvb3Q+JyxcbiAgICAgICAgICB1cmw6ICcvJ1xuICAgICAgICB9KTtcbiAgICAgIGA7XG5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMSBmcm9tIFwiLi9hcHAvYXBwLm1vZHVsZS5uZ2ZhY3RvcnlcIjtcbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyXCI7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9fTmdDbGlfYm9vdHN0cmFwXzIucmVuZGVyTW9kdWxlRmFjdG9yeShfX05nQ2xpX2Jvb3RzdHJhcF8xLkFwcE1vZHVsZU5nRmFjdG9yeSwge1xuICAgICAgICAgICAgZG9jdW1lbnQ6ICc8YXBwLXJvb3Q+PC9hcHAtcm9vdD4nLFxuICAgICAgICAgICAgdXJsOiAnLydcbiAgICAgICAgICB9KTtcbiAgICAgIGA7XG4gICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aFxuXG4gICAgICBjb25zdCB7IHByb2dyYW0sIGNvbXBpbGVySG9zdCB9ID0gY3JlYXRlVHlwZXNjcmlwdENvbnRleHQoaW5wdXQpO1xuICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSByZXBsYWNlU2VydmVyQm9vdHN0cmFwKFxuICAgICAgICAoKSA9PiB0cnVlLFxuICAgICAgICAoKSA9PiAoW3sgcGF0aDogJy9wcm9qZWN0L3NyYy9hcHAvYXBwLm1vZHVsZScsIGNsYXNzTmFtZTogJ0FwcE1vZHVsZScgfV0pLFxuICAgICAgICAoKSA9PiBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCksXG4gICAgICApO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtVHlwZXNjcmlwdCh1bmRlZmluZWQsIFt0cmFuc2Zvcm1lcl0sIHByb2dyYW0sIGNvbXBpbGVySG9zdCk7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtyZXN1bHR9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2Ugd2hlbiB0aGUgbW9kdWxlIGlzIHVzZWQgaW4gYSBjb25maWcgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuXG4gICAgICAgIGltcG9ydCB7IGVuYWJsZVByb2RNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IG5nRXhwcmVzc0VuZ2luZSB9IGZyb20gJ0BuZ3VuaXZlcnNhbC9leHByZXNzLWVuZ2luZSc7XG5cbiAgICAgICAgaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAvYXBwLm1vZHVsZSc7XG4gICAgICAgIGltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5wcm9kdWN0aW9uKSB7XG4gICAgICAgICAgZW5hYmxlUHJvZE1vZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IGV4cHJlc3MoKTtcbiAgICAgICAgc2VydmVyLmVuZ2luZSgnaHRtbCcsIG5nRXhwcmVzc0VuZ2luZSh7XG4gICAgICAgICAgYm9vdHN0cmFwOiBBcHBNb2R1bGVcbiAgICAgICAgfSkpO1xuICAgICAgYDtcblxuICAgICAgLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuXG4gICAgICAgIGltcG9ydCB7IGVuYWJsZVByb2RNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IG5nRXhwcmVzc0VuZ2luZSB9IGZyb20gJ0BuZ3VuaXZlcnNhbC9leHByZXNzLWVuZ2luZSc7XG5cbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMSBmcm9tIFwiLi9hcHAvYXBwLm1vZHVsZS5uZ2ZhY3RvcnlcIjtcblxuICAgICAgICBpZiAoZW52aXJvbm1lbnQucHJvZHVjdGlvbikge1xuICAgICAgICAgIGVuYWJsZVByb2RNb2RlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBleHByZXNzKCk7XG4gICAgICAgIHNlcnZlci5lbmdpbmUoJ2h0bWwnLCBuZ0V4cHJlc3NFbmdpbmUoe1xuICAgICAgICAgIGJvb3RzdHJhcDogX19OZ0NsaV9ib290c3RyYXBfMS5BcHBNb2R1bGVOZ0ZhY3RvcnlcbiAgICAgICAgfSkpO1xuICAgICAgYDtcbiAgICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG5cbiAgICAgIGNvbnN0IHsgcHJvZ3JhbSwgY29tcGlsZXJIb3N0IH0gPSBjcmVhdGVUeXBlc2NyaXB0Q29udGV4dChpbnB1dCk7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHJlcGxhY2VTZXJ2ZXJCb290c3RyYXAoXG4gICAgICAgICgpID0+IHRydWUsXG4gICAgICAgICgpID0+IChbeyBwYXRoOiAnL3Byb2plY3Qvc3JjL2FwcC9hcHAubW9kdWxlJywgY2xhc3NOYW1lOiAnQXBwTW9kdWxlJyB9XSksXG4gICAgICAgICgpID0+IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KHVuZGVmaW5lZCwgW3RyYW5zZm9ybWVyXSwgcHJvZ3JhbSwgY29tcGlsZXJIb3N0KTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVwbGFjZSBib290c3RyYXAgd2hlbiBiYXJyZWwgZmlsZXMgYXJlIHVzZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IGVuYWJsZVByb2RNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IHBsYXRmb3JtRHluYW1pY1NlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYyc7XG5cbiAgICAgICAgaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAnO1xuICAgICAgICBpbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcblxuICAgICAgICBpZiAoZW52aXJvbm1lbnQucHJvZHVjdGlvbikge1xuICAgICAgICAgIGVuYWJsZVByb2RNb2RlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF0Zm9ybUR5bmFtaWNTZXJ2ZXIoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtcbiAgICAgIGA7XG5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMSBmcm9tIFwiLi9hcHAvYXBwLm1vZHVsZS5uZ2ZhY3RvcnlcIjtcbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyXCI7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9fTmdDbGlfYm9vdHN0cmFwXzIucGxhdGZvcm1TZXJ2ZXIoKS5ib290c3RyYXBNb2R1bGVGYWN0b3J5KF9fTmdDbGlfYm9vdHN0cmFwXzEuQXBwTW9kdWxlTmdGYWN0b3J5KTtcbiAgICAgIGA7XG4gICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aFxuXG4gICAgICBjb25zdCB7IHByb2dyYW0sIGNvbXBpbGVySG9zdCB9ID0gY3JlYXRlVHlwZXNjcmlwdENvbnRleHQoaW5wdXQpO1xuICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSByZXBsYWNlU2VydmVyQm9vdHN0cmFwKFxuICAgICAgICAoKSA9PiB0cnVlLFxuICAgICAgICAoKSA9PiAoW3sgcGF0aDogJy9wcm9qZWN0L3NyYy9hcHAvYXBwLm1vZHVsZScsIGNsYXNzTmFtZTogJ0FwcE1vZHVsZScgfV0pLFxuICAgICAgICAoKSA9PiBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCksXG4gICAgICApO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtVHlwZXNjcmlwdCh1bmRlZmluZWQsIFt0cmFuc2Zvcm1lcl0sIHByb2dyYW0sIGNvbXBpbGVySG9zdCk7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtyZXN1bHR9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXBsYWNlIGJvb3RzdHJhcCB3aGVuIHRoZXJlIGlzIG5vIGVudHJ5IG1vZHVsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgcGxhdGZvcm1EeW5hbWljU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhdGZvcm1EeW5hbWljU2VydmVyKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XG4gICAgICBgO1xuXG4gICAgICBjb25zdCB7IHByb2dyYW0sIGNvbXBpbGVySG9zdCB9ID0gY3JlYXRlVHlwZXNjcmlwdENvbnRleHQoaW5wdXQpO1xuICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSByZXBsYWNlU2VydmVyQm9vdHN0cmFwKFxuICAgICAgICAoKSA9PiB0cnVlLFxuICAgICAgICAoKSA9PiBudWxsLFxuICAgICAgICAoKSA9PiBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCksXG4gICAgICApO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtVHlwZXNjcmlwdCh1bmRlZmluZWQsIFt0cmFuc2Zvcm1lcl0sIHByb2dyYW0sIGNvbXBpbGVySG9zdCk7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtyZXN1bHR9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtpbnB1dH1gKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==