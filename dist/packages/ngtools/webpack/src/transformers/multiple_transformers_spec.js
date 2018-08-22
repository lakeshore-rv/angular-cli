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
const export_ngfactory_1 = require("./export_ngfactory");
const remove_decorators_1 = require("./remove_decorators");
const replace_bootstrap_1 = require("./replace_bootstrap");
describe('@ngtools/webpack transformers', () => {
    describe('multiple_transformers', () => {
        it('should apply multiple transformers on the same file', () => {
            const input = core_1.tags.stripIndent `
        import { enableProdMode } from '@angular/core';
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
        import { Component } from '@angular/core';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        class AppComponent {
          title = 'app';
        }

        if (environment.production) {
          enableProdMode();
        }

        platformBrowserDynamic().bootstrapModule(AppModule);
      `;
            // tslint:disable:max-line-length
            const output = core_1.tags.stripIndent `
        import * as __lazy_0__ from "./app/lazy/lazy.module.ngfactory.ts";
        import * as __lazy_1__ from "./app/lazy2/lazy2.module.ngfactory.ts";

        import { enableProdMode } from '@angular/core';
        import { environment } from './environments/environment';

        import * as __NgCli_bootstrap_1 from "./app/app.module.ngfactory";
        import * as __NgCli_bootstrap_2 from "@angular/platform-browser";

        class AppComponent {
          constructor() { this.title = 'app'; }
        }

        if (environment.production) {
          enableProdMode();
        }
        __NgCli_bootstrap_2.platformBrowser().bootstrapModuleFactory(__NgCli_bootstrap_1.AppModuleNgFactory);

        export var LAZY_MODULE_MAP = { "./lazy/lazy.module#LazyModule": __lazy_0__.LazyModuleNgFactory, "./lazy2/lazy2.module#LazyModule2": __lazy_1__.LazyModule2NgFactory };
      `;
            // tslint:enable:max-line-length
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const shouldTransform = () => true;
            const getEntryModules = () => ([{ path: '/project/src/app/app.module', className: 'AppModule' }]);
            const getTypeChecker = () => program.getTypeChecker();
            const transformers = [
                replace_bootstrap_1.replaceBootstrap(shouldTransform, getEntryModules, getTypeChecker),
                export_ngfactory_1.exportNgFactory(shouldTransform, getEntryModules),
                export_lazy_module_map_1.exportLazyModuleMap(shouldTransform, () => ({
                    './lazy/lazy.module.ngfactory#LazyModuleNgFactory': '/project/src/app/lazy/lazy.module.ngfactory.ts',
                    './lazy2/lazy2.module.ngfactory#LazyModule2NgFactory': '/project/src/app/lazy2/lazy2.module.ngfactory.ts',
                })),
                remove_decorators_1.removeDecorators(shouldTransform, getTypeChecker),
            ];
            const result = ast_helpers_1.transformTypescript(undefined, transformers, program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGVfdHJhbnNmb3JtZXJzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL25ndG9vbHMvd2VicGFjay9zcmMvdHJhbnNmb3JtZXJzL211bHRpcGxlX3RyYW5zZm9ybWVyc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQTRDLENBQUUsK0NBQStDO0FBQzdGLCtDQUE2RTtBQUM3RSxxRUFBK0Q7QUFDL0QseURBQXFEO0FBQ3JELDJEQUF1RDtBQUN2RCwyREFBdUQ7QUFHdkQsUUFBUSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUM3QyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXNCN0IsQ0FBQztZQUVGLGlDQUFpQztZQUNqQyxNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9COUIsQ0FBQztZQUNGLGdDQUFnQztZQUVoQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxHQUFHLHFDQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWpFLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNuQyxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FDM0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEUsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBR3RELE1BQU0sWUFBWSxHQUFHO2dCQUNuQixvQ0FBZ0IsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQztnQkFDbEUsa0NBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO2dCQUNqRCw0Q0FBbUIsQ0FBQyxlQUFlLEVBQ2pDLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ0wsa0RBQWtELEVBQ2xELGdEQUFnRDtvQkFDaEQscURBQXFELEVBQ3JELGtEQUFrRDtpQkFDbkQsQ0FBQyxDQUFDO2dCQUNMLG9DQUFnQixDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUM7YUFDbEQsQ0FBQztZQUVGLE1BQU0sTUFBTSxHQUFHLGlDQUFtQixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRW5GLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgdGFncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJzsgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBjcmVhdGVUeXBlc2NyaXB0Q29udGV4dCwgdHJhbnNmb3JtVHlwZXNjcmlwdCB9IGZyb20gJy4vYXN0X2hlbHBlcnMnO1xuaW1wb3J0IHsgZXhwb3J0TGF6eU1vZHVsZU1hcCB9IGZyb20gJy4vZXhwb3J0X2xhenlfbW9kdWxlX21hcCc7XG5pbXBvcnQgeyBleHBvcnROZ0ZhY3RvcnkgfSBmcm9tICcuL2V4cG9ydF9uZ2ZhY3RvcnknO1xuaW1wb3J0IHsgcmVtb3ZlRGVjb3JhdG9ycyB9IGZyb20gJy4vcmVtb3ZlX2RlY29yYXRvcnMnO1xuaW1wb3J0IHsgcmVwbGFjZUJvb3RzdHJhcCB9IGZyb20gJy4vcmVwbGFjZV9ib290c3RyYXAnO1xuXG5cbmRlc2NyaWJlKCdAbmd0b29scy93ZWJwYWNrIHRyYW5zZm9ybWVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ211bHRpcGxlX3RyYW5zZm9ybWVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IG11bHRpcGxlIHRyYW5zZm9ybWVycyBvbiB0aGUgc2FtZSBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljJztcbiAgICAgICAgaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbiAgICAgICAgaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAvYXBwLm1vZHVsZSc7XG4gICAgICAgIGltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG4gICAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJ11cbiAgICAgICAgfSlcbiAgICAgICAgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhdGZvcm1Ccm93c2VyRHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xuICAgICAgYDtcblxuICAgICAgLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgKiBhcyBfX2xhenlfMF9fIGZyb20gXCIuL2FwcC9sYXp5L2xhenkubW9kdWxlLm5nZmFjdG9yeS50c1wiO1xuICAgICAgICBpbXBvcnQgKiBhcyBfX2xhenlfMV9fIGZyb20gXCIuL2FwcC9sYXp5Mi9sYXp5Mi5tb2R1bGUubmdmYWN0b3J5LnRzXCI7XG5cbiAgICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMSBmcm9tIFwiLi9hcHAvYXBwLm1vZHVsZS5uZ2ZhY3RvcnlcIjtcbiAgICAgICAgaW1wb3J0ICogYXMgX19OZ0NsaV9ib290c3RyYXBfMiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiO1xuXG4gICAgICAgIGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3IoKSB7IHRoaXMudGl0bGUgPSAnYXBwJzsgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9fTmdDbGlfYm9vdHN0cmFwXzIucGxhdGZvcm1Ccm93c2VyKCkuYm9vdHN0cmFwTW9kdWxlRmFjdG9yeShfX05nQ2xpX2Jvb3RzdHJhcF8xLkFwcE1vZHVsZU5nRmFjdG9yeSk7XG5cbiAgICAgICAgZXhwb3J0IHZhciBMQVpZX01PRFVMRV9NQVAgPSB7IFwiLi9sYXp5L2xhenkubW9kdWxlI0xhenlNb2R1bGVcIjogX19sYXp5XzBfXy5MYXp5TW9kdWxlTmdGYWN0b3J5LCBcIi4vbGF6eTIvbGF6eTIubW9kdWxlI0xhenlNb2R1bGUyXCI6IF9fbGF6eV8xX18uTGF6eU1vZHVsZTJOZ0ZhY3RvcnkgfTtcbiAgICAgIGA7XG4gICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aFxuXG4gICAgICBjb25zdCB7IHByb2dyYW0sIGNvbXBpbGVySG9zdCB9ID0gY3JlYXRlVHlwZXNjcmlwdENvbnRleHQoaW5wdXQpO1xuXG4gICAgICBjb25zdCBzaG91bGRUcmFuc2Zvcm0gPSAoKSA9PiB0cnVlO1xuICAgICAgY29uc3QgZ2V0RW50cnlNb2R1bGVzID0gKCkgPT5cbiAgICAgICAgKFt7IHBhdGg6ICcvcHJvamVjdC9zcmMvYXBwL2FwcC5tb2R1bGUnLCBjbGFzc05hbWU6ICdBcHBNb2R1bGUnIH1dKTtcbiAgICAgIGNvbnN0IGdldFR5cGVDaGVja2VyID0gKCkgPT4gcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpO1xuXG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVycyA9IFtcbiAgICAgICAgcmVwbGFjZUJvb3RzdHJhcChzaG91bGRUcmFuc2Zvcm0sIGdldEVudHJ5TW9kdWxlcywgZ2V0VHlwZUNoZWNrZXIpLFxuICAgICAgICBleHBvcnROZ0ZhY3Rvcnkoc2hvdWxkVHJhbnNmb3JtLCBnZXRFbnRyeU1vZHVsZXMpLFxuICAgICAgICBleHBvcnRMYXp5TW9kdWxlTWFwKHNob3VsZFRyYW5zZm9ybSxcbiAgICAgICAgICAoKSA9PiAoe1xuICAgICAgICAgICAgJy4vbGF6eS9sYXp5Lm1vZHVsZS5uZ2ZhY3RvcnkjTGF6eU1vZHVsZU5nRmFjdG9yeSc6XG4gICAgICAgICAgICAnL3Byb2plY3Qvc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlLm5nZmFjdG9yeS50cycsXG4gICAgICAgICAgICAnLi9sYXp5Mi9sYXp5Mi5tb2R1bGUubmdmYWN0b3J5I0xhenlNb2R1bGUyTmdGYWN0b3J5JzpcbiAgICAgICAgICAgICcvcHJvamVjdC9zcmMvYXBwL2xhenkyL2xhenkyLm1vZHVsZS5uZ2ZhY3RvcnkudHMnLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgcmVtb3ZlRGVjb3JhdG9ycyhzaG91bGRUcmFuc2Zvcm0sIGdldFR5cGVDaGVja2VyKSxcbiAgICAgIF07XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQodW5kZWZpbmVkLCB0cmFuc2Zvcm1lcnMsIHByb2dyYW0sIGNvbXBpbGVySG9zdCk7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHtyZXN1bHR9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=