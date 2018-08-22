"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/architect/testing");
const core_1 = require("@angular-devkit/core");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
exports.lazyModuleFiles = {
    'src/app/lazy/lazy-routing.module.ts': `
    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';

    const routes: Routes = [];

    @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    })
    export class LazyRoutingModule { }
  `,
    'src/app/lazy/lazy.module.ts': `
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';

    import { LazyRoutingModule } from './lazy-routing.module';

    @NgModule({
      imports: [
        CommonModule,
        LazyRoutingModule
      ],
      declarations: []
    })
    export class LazyModule { }
  `,
};
exports.lazyModuleImport = {
    'src/app/app.module.ts': `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { HttpModule } from '@angular/http';

    import { AppComponent } from './app.component';
    import { RouterModule } from '@angular/router';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot([
          { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' }
        ])
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  `,
};
describe('Browser Builder lazy modules', () => {
    const outputPath = core_1.normalize('dist');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('supports lazy bundle for lazy routes with JIT', (done) => {
        utils_1.host.writeMultipleFiles(exports.lazyModuleFiles);
        utils_1.host.writeMultipleFiles(exports.lazyModuleImport);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, 'lazy-lazy-module.js'))).toBe(true);
        })).toPromise().then(done, done.fail);
    });
    it('supports lazy bundle for lazy routes with AOT', (done) => {
        utils_1.host.writeMultipleFiles(exports.lazyModuleFiles);
        utils_1.host.writeMultipleFiles(exports.lazyModuleImport);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { aot: true }).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            expect(utils_1.host.scopedSync()
                .exists(core_1.join(outputPath, 'lazy-lazy-module-ngfactory.js'))).toBe(true);
        })).toPromise().then(done, done.fail);
    });
    it(`supports lazy bundle for import() calls`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/lazy-module.ts': 'export const value = 42;',
            'src/main.ts': `import('./lazy-module');`,
        });
        // Using `import()` in TS require targetting `esnext` modules.
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '0.js'))).toBe(true))).toPromise().then(done, done.fail);
    });
    it(`supports lazy bundle for dynamic import() calls`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/lazy-module.ts': 'export const value = 42;',
            'src/main.ts': `
        const lazyFileName = 'module';
        import(/*webpackChunkName: '[request]'*/'./lazy-' + lazyFileName);
      `,
        });
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, 'lazy-module.js'))).toBe(true))).toPromise().then(done, done.fail);
    });
    it(`supports lazy bundle for System.import() calls`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/lazy-module.ts': 'export const value = 42;',
            'src/main.ts': `declare var System: any; System.import('./lazy-module');`,
        });
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '0.js'))).toBe(true))).toPromise().then(done, done.fail);
    });
    it(`supports hiding lazy bundle module name`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/lazy-module.ts': 'export const value = 42;',
            'src/main.ts': `const lazyFileName = 'module'; import('./lazy-' + lazyFileName);`,
        });
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        const overrides = { namedChunks: false };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '0.js'))).toBe(true))).toPromise().then(done, done.fail);
    });
    it(`supports making a common bundle for shared lazy modules`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/one.ts': `import * as http from '@angular/http'; console.log(http);`,
            'src/two.ts': `import * as http from '@angular/http'; console.log(http);`,
            'src/main.ts': `import('./one'); import('./two');`,
        });
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '0.js'))).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '1.js'))).toBe(true)), 
        // TODO: the chunk with common modules used to be called `common`, see why that changed.
        operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '2.js'))).toBe(true))).toPromise().then(done, done.fail);
    });
    it(`supports disabling the common bundle`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/one.ts': `import * as http from '@angular/http'; console.log(http);`,
            'src/two.ts': `import * as http from '@angular/http'; console.log(http);`,
            'src/main.ts': `import('./one'); import('./two');`,
        });
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        const overrides = { commonChunk: false };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '0.js'))).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '1.js'))).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, '2.js'))).toBe(false))).toPromise().then(done, done.fail);
    });
    it(`supports extra lazy modules array in JIT`, (done) => {
        utils_1.host.writeMultipleFiles(exports.lazyModuleFiles);
        utils_1.host.writeMultipleFiles({
            'src/app/app.component.ts': `
        import { Component, SystemJsNgModuleLoader } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css'],
        })
        export class AppComponent {
          title = 'app';
          constructor(loader: SystemJsNgModuleLoader) {
            // Module will be split at build time and loaded when requested below
            loader.load('src/app/lazy/lazy.module#LazyModule')
              .then((factory) => { /* Use factory here */ });
          }
        }`,
        });
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        const overrides = { lazyModules: ['src/app/lazy/lazy.module'] };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, 'src-app-lazy-lazy-module.js')))
            .toBe(true))).toPromise().then(done, done.fail);
    });
    it(`supports extra lazy modules array in AOT`, (done) => {
        utils_1.host.writeMultipleFiles(exports.lazyModuleFiles);
        utils_1.host.writeMultipleFiles({
            'src/app/app.component.ts': `
        import { Component, SystemJsNgModuleLoader } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css'],
        })
        export class AppComponent {
          title = 'app';
          constructor(loader: SystemJsNgModuleLoader) {
            // Module will be split at build time and loaded when requested below
            loader.load('src/app/lazy/lazy.module#LazyModule')
              .then((factory) => { /* Use factory here */ });
          }
        }`,
        });
        utils_1.host.replaceInFile('src/tsconfig.app.json', `"module": "es2015"`, `"module": "esnext"`);
        const overrides = {
            lazyModules: ['src/app/lazy/lazy.module'],
            aot: true,
            optimization: true,
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => expect(utils_1.host.scopedSync()
            .exists(core_1.join(outputPath, 'src-app-lazy-lazy-module-ngfactory.js')))
            .toBe(true))).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eS1tb2R1bGVfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2Jyb3dzZXIvbGF6eS1tb2R1bGVfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRjtBQUNsRiwrQ0FBdUQ7QUFDdkQsOENBQXFDO0FBRXJDLG9DQUFtRDtBQUd0QyxRQUFBLGVBQWUsR0FBK0I7SUFDekQscUNBQXFDLEVBQUU7Ozs7Ozs7Ozs7O0dBV3RDO0lBQ0QsNkJBQTZCLEVBQUU7Ozs7Ozs7Ozs7Ozs7O0dBYzlCO0NBQ0YsQ0FBQztBQUVXLFFBQUEsZ0JBQWdCLEdBQStCO0lBQzFELHVCQUF1QixFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCeEI7Q0FDRixDQUFDO0FBRUYsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtJQUU1QyxNQUFNLFVBQVUsR0FBRyxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzNELFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBZSxDQUFDLENBQUM7UUFDekMsWUFB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Q1QsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQztRQUVGLHVCQUFhLENBQUMsWUFBSSxFQUFFLHlCQUFpQixFQUFFLFNBQVMsRUFBRSx3QkFBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDeEUsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUMxRCxlQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUU7YUFDL0IsTUFBTSxDQUFDLFdBQUksQ0FBQyxVQUFVLEVBQUUsdUNBQXVDLENBQUMsQ0FBQyxDQUFDO2FBQ2xFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUNmLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgRGVmYXVsdFRpbWVvdXQsIHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQnJvd3NlckJ1aWxkZXJTY2hlbWEgfSBmcm9tICcuLi8uLi9zcmMnO1xuaW1wb3J0IHsgYnJvd3NlclRhcmdldFNwZWMsIGhvc3QgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZXhwb3J0IGNvbnN0IGxhenlNb2R1bGVGaWxlczogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICdzcmMvYXBwL2xhenkvbGF6eS1yb3V0aW5nLm1vZHVsZS50cyc6IGBcbiAgICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgIGltcG9ydCB7IFJvdXRlcywgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuICAgIGNvbnN0IHJvdXRlczogUm91dGVzID0gW107XG5cbiAgICBATmdNb2R1bGUoe1xuICAgICAgaW1wb3J0czogW1JvdXRlck1vZHVsZS5mb3JDaGlsZChyb3V0ZXMpXSxcbiAgICAgIGV4cG9ydHM6IFtSb3V0ZXJNb2R1bGVdXG4gICAgfSlcbiAgICBleHBvcnQgY2xhc3MgTGF6eVJvdXRpbmdNb2R1bGUgeyB9XG4gIGAsXG4gICdzcmMvYXBwL2xhenkvbGF6eS5tb2R1bGUudHMnOiBgXG4gICAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICBpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4gICAgaW1wb3J0IHsgTGF6eVJvdXRpbmdNb2R1bGUgfSBmcm9tICcuL2xhenktcm91dGluZy5tb2R1bGUnO1xuXG4gICAgQE5nTW9kdWxlKHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBMYXp5Um91dGluZ01vZHVsZVxuICAgICAgXSxcbiAgICAgIGRlY2xhcmF0aW9uczogW11cbiAgICB9KVxuICAgIGV4cG9ydCBjbGFzcyBMYXp5TW9kdWxlIHsgfVxuICBgLFxufTtcblxuZXhwb3J0IGNvbnN0IGxhenlNb2R1bGVJbXBvcnQ6IHsgW3BhdGg6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAnc3JjL2FwcC9hcHAubW9kdWxlLnRzJzogYFxuICAgIGltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbiAgICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgIGltcG9ydCB7IEh0dHBNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9odHRwJztcblxuICAgIGltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XG4gICAgaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuICAgIEBOZ01vZHVsZSh7XG4gICAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgICBdLFxuICAgICAgaW1wb3J0czogW1xuICAgICAgICBCcm93c2VyTW9kdWxlLFxuICAgICAgICBIdHRwTW9kdWxlLFxuICAgICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChbXG4gICAgICAgICAgeyBwYXRoOiAnbGF6eScsIGxvYWRDaGlsZHJlbjogJy4vbGF6eS9sYXp5Lm1vZHVsZSNMYXp5TW9kdWxlJyB9XG4gICAgICAgIF0pXG4gICAgICBdLFxuICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICB9KVxuICAgIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9XG4gIGAsXG59O1xuXG5kZXNjcmliZSgnQnJvd3NlciBCdWlsZGVyIGxhenkgbW9kdWxlcycsICgpID0+IHtcblxuICBjb25zdCBvdXRwdXRQYXRoID0gbm9ybWFsaXplKCdkaXN0Jyk7XG5cbiAgYmVmb3JlRWFjaChkb25lID0+IGhvc3QuaW5pdGlhbGl6ZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG4gIGFmdGVyRWFjaChkb25lID0+IGhvc3QucmVzdG9yZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cbiAgaXQoJ3N1cHBvcnRzIGxhenkgYnVuZGxlIGZvciBsYXp5IHJvdXRlcyB3aXRoIEpJVCcsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMobGF6eU1vZHVsZUZpbGVzKTtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhsYXp5TW9kdWxlSW1wb3J0KTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhqb2luKG91dHB1dFBhdGgsICdsYXp5LWxhenktbW9kdWxlLmpzJykpKS50b0JlKHRydWUpO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdzdXBwb3J0cyBsYXp5IGJ1bmRsZSBmb3IgbGF6eSByb3V0ZXMgd2l0aCBBT1QnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKGxhenlNb2R1bGVGaWxlcyk7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMobGF6eU1vZHVsZUltcG9ydCk7XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCB7IGFvdDogdHJ1ZSB9KS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKVxuICAgICAgICAgIC5leGlzdHMoam9pbihvdXRwdXRQYXRoLCAnbGF6eS1sYXp5LW1vZHVsZS1uZ2ZhY3RvcnkuanMnKSkpLnRvQmUodHJ1ZSk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoYHN1cHBvcnRzIGxhenkgYnVuZGxlIGZvciBpbXBvcnQoKSBjYWxsc2AsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9sYXp5LW1vZHVsZS50cyc6ICdleHBvcnQgY29uc3QgdmFsdWUgPSA0MjsnLFxuICAgICAgJ3NyYy9tYWluLnRzJzogYGltcG9ydCgnLi9sYXp5LW1vZHVsZScpO2AsXG4gICAgfSk7XG4gICAgLy8gVXNpbmcgYGltcG9ydCgpYCBpbiBUUyByZXF1aXJlIHRhcmdldHRpbmcgYGVzbmV4dGAgbW9kdWxlcy5cbiAgICBob3N0LnJlcGxhY2VJbkZpbGUoJ3NyYy90c2NvbmZpZy5hcHAuanNvbicsIGBcIm1vZHVsZVwiOiBcImVzMjAxNVwiYCwgYFwibW9kdWxlXCI6IFwiZXNuZXh0XCJgKTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMoam9pbihvdXRwdXRQYXRoLCAnMC5qcycpKSkudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBzdXBwb3J0cyBsYXp5IGJ1bmRsZSBmb3IgZHluYW1pYyBpbXBvcnQoKSBjYWxsc2AsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9sYXp5LW1vZHVsZS50cyc6ICdleHBvcnQgY29uc3QgdmFsdWUgPSA0MjsnLFxuICAgICAgJ3NyYy9tYWluLnRzJzogYFxuICAgICAgICBjb25zdCBsYXp5RmlsZU5hbWUgPSAnbW9kdWxlJztcbiAgICAgICAgaW1wb3J0KC8qd2VicGFja0NodW5rTmFtZTogJ1tyZXF1ZXN0XScqLycuL2xhenktJyArIGxhenlGaWxlTmFtZSk7XG4gICAgICBgLFxuICAgIH0pO1xuICAgIGhvc3QucmVwbGFjZUluRmlsZSgnc3JjL3RzY29uZmlnLmFwcC5qc29uJywgYFwibW9kdWxlXCI6IFwiZXMyMDE1XCJgLCBgXCJtb2R1bGVcIjogXCJlc25leHRcImApO1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4gZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhqb2luKG91dHB1dFBhdGgsICdsYXp5LW1vZHVsZS5qcycpKSkudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBzdXBwb3J0cyBsYXp5IGJ1bmRsZSBmb3IgU3lzdGVtLmltcG9ydCgpIGNhbGxzYCwgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL2xhenktbW9kdWxlLnRzJzogJ2V4cG9ydCBjb25zdCB2YWx1ZSA9IDQyOycsXG4gICAgICAnc3JjL21haW4udHMnOiBgZGVjbGFyZSB2YXIgU3lzdGVtOiBhbnk7IFN5c3RlbS5pbXBvcnQoJy4vbGF6eS1tb2R1bGUnKTtgLFxuICAgIH0pO1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4gZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhqb2luKG91dHB1dFBhdGgsICcwLmpzJykpKS50b0JlKHRydWUpKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoYHN1cHBvcnRzIGhpZGluZyBsYXp5IGJ1bmRsZSBtb2R1bGUgbmFtZWAsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9sYXp5LW1vZHVsZS50cyc6ICdleHBvcnQgY29uc3QgdmFsdWUgPSA0MjsnLFxuICAgICAgJ3NyYy9tYWluLnRzJzogYGNvbnN0IGxhenlGaWxlTmFtZSA9ICdtb2R1bGUnOyBpbXBvcnQoJy4vbGF6eS0nICsgbGF6eUZpbGVOYW1lKTtgLFxuICAgIH0pO1xuICAgIGhvc3QucmVwbGFjZUluRmlsZSgnc3JjL3RzY29uZmlnLmFwcC5qc29uJywgYFwibW9kdWxlXCI6IFwiZXMyMDE1XCJgLCBgXCJtb2R1bGVcIjogXCJlc25leHRcImApO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzOiBQYXJ0aWFsPEJyb3dzZXJCdWlsZGVyU2NoZW1hPiA9IHsgbmFtZWRDaHVua3M6IGZhbHNlIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMoam9pbihvdXRwdXRQYXRoLCAnMC5qcycpKSkudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBzdXBwb3J0cyBtYWtpbmcgYSBjb21tb24gYnVuZGxlIGZvciBzaGFyZWQgbGF6eSBtb2R1bGVzYCwgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL29uZS50cyc6IGBpbXBvcnQgKiBhcyBodHRwIGZyb20gJ0Bhbmd1bGFyL2h0dHAnOyBjb25zb2xlLmxvZyhodHRwKTtgLFxuICAgICAgJ3NyYy90d28udHMnOiBgaW1wb3J0ICogYXMgaHR0cCBmcm9tICdAYW5ndWxhci9odHRwJzsgY29uc29sZS5sb2coaHR0cCk7YCxcbiAgICAgICdzcmMvbWFpbi50cyc6IGBpbXBvcnQoJy4vb25lJyk7IGltcG9ydCgnLi90d28nKTtgLFxuICAgIH0pO1xuICAgIGhvc3QucmVwbGFjZUluRmlsZSgnc3JjL3RzY29uZmlnLmFwcC5qc29uJywgYFwibW9kdWxlXCI6IFwiZXMyMDE1XCJgLCBgXCJtb2R1bGVcIjogXCJlc25leHRcImApO1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4gZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhqb2luKG91dHB1dFBhdGgsICcwLmpzJykpKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKGpvaW4ob3V0cHV0UGF0aCwgJzEuanMnKSkpLnRvQmUodHJ1ZSkpLFxuICAgICAgLy8gVE9ETzogdGhlIGNodW5rIHdpdGggY29tbW9uIG1vZHVsZXMgdXNlZCB0byBiZSBjYWxsZWQgYGNvbW1vbmAsIHNlZSB3aHkgdGhhdCBjaGFuZ2VkLlxuICAgICAgdGFwKCgpID0+IGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMoam9pbihvdXRwdXRQYXRoLCAnMi5qcycpKSkudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBzdXBwb3J0cyBkaXNhYmxpbmcgdGhlIGNvbW1vbiBidW5kbGVgLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvb25lLnRzJzogYGltcG9ydCAqIGFzIGh0dHAgZnJvbSAnQGFuZ3VsYXIvaHR0cCc7IGNvbnNvbGUubG9nKGh0dHApO2AsXG4gICAgICAnc3JjL3R3by50cyc6IGBpbXBvcnQgKiBhcyBodHRwIGZyb20gJ0Bhbmd1bGFyL2h0dHAnOyBjb25zb2xlLmxvZyhodHRwKTtgLFxuICAgICAgJ3NyYy9tYWluLnRzJzogYGltcG9ydCgnLi9vbmUnKTsgaW1wb3J0KCcuL3R3bycpO2AsXG4gICAgfSk7XG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvdHNjb25maWcuYXBwLmpzb24nLCBgXCJtb2R1bGVcIjogXCJlczIwMTVcImAsIGBcIm1vZHVsZVwiOiBcImVzbmV4dFwiYCk7XG5cbiAgICBjb25zdCBvdmVycmlkZXM6IFBhcnRpYWw8QnJvd3NlckJ1aWxkZXJTY2hlbWE+ID0geyBjb21tb25DaHVuazogZmFsc2UgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4gZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhqb2luKG91dHB1dFBhdGgsICcwLmpzJykpKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKGpvaW4ob3V0cHV0UGF0aCwgJzEuanMnKSkpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMoam9pbihvdXRwdXRQYXRoLCAnMi5qcycpKSkudG9CZShmYWxzZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdChgc3VwcG9ydHMgZXh0cmEgbGF6eSBtb2R1bGVzIGFycmF5IGluIEpJVGAsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMobGF6eU1vZHVsZUZpbGVzKTtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJzogYFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQsIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddLFxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICAgIGNvbnN0cnVjdG9yKGxvYWRlcjogU3lzdGVtSnNOZ01vZHVsZUxvYWRlcikge1xuICAgICAgICAgICAgLy8gTW9kdWxlIHdpbGwgYmUgc3BsaXQgYXQgYnVpbGQgdGltZSBhbmQgbG9hZGVkIHdoZW4gcmVxdWVzdGVkIGJlbG93XG4gICAgICAgICAgICBsb2FkZXIubG9hZCgnc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlI0xhenlNb2R1bGUnKVxuICAgICAgICAgICAgICAudGhlbigoZmFjdG9yeSkgPT4geyAvKiBVc2UgZmFjdG9yeSBoZXJlICovIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfWAsXG4gICAgfSk7XG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvdHNjb25maWcuYXBwLmpzb24nLCBgXCJtb2R1bGVcIjogXCJlczIwMTVcImAsIGBcIm1vZHVsZVwiOiBcImVzbmV4dFwiYCk7XG5cbiAgICBjb25zdCBvdmVycmlkZXM6IFBhcnRpYWw8QnJvd3NlckJ1aWxkZXJTY2hlbWE+ID0geyBsYXp5TW9kdWxlczogWydzcmMvYXBwL2xhenkvbGF6eS5tb2R1bGUnXSB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKGpvaW4ob3V0cHV0UGF0aCwgJ3NyYy1hcHAtbGF6eS1sYXp5LW1vZHVsZS5qcycpKSlcbiAgICAgICAgLnRvQmUodHJ1ZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdChgc3VwcG9ydHMgZXh0cmEgbGF6eSBtb2R1bGVzIGFycmF5IGluIEFPVGAsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMobGF6eU1vZHVsZUZpbGVzKTtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJzogYFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQsIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddLFxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICAgIGNvbnN0cnVjdG9yKGxvYWRlcjogU3lzdGVtSnNOZ01vZHVsZUxvYWRlcikge1xuICAgICAgICAgICAgLy8gTW9kdWxlIHdpbGwgYmUgc3BsaXQgYXQgYnVpbGQgdGltZSBhbmQgbG9hZGVkIHdoZW4gcmVxdWVzdGVkIGJlbG93XG4gICAgICAgICAgICBsb2FkZXIubG9hZCgnc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlI0xhenlNb2R1bGUnKVxuICAgICAgICAgICAgICAudGhlbigoZmFjdG9yeSkgPT4geyAvKiBVc2UgZmFjdG9yeSBoZXJlICovIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfWAsXG4gICAgfSk7XG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvdHNjb25maWcuYXBwLmpzb24nLCBgXCJtb2R1bGVcIjogXCJlczIwMTVcImAsIGBcIm1vZHVsZVwiOiBcImVzbmV4dFwiYCk7XG5cbiAgICBjb25zdCBvdmVycmlkZXM6IFBhcnRpYWw8QnJvd3NlckJ1aWxkZXJTY2hlbWE+ID0ge1xuICAgICAgbGF6eU1vZHVsZXM6IFsnc3JjL2FwcC9sYXp5L2xhenkubW9kdWxlJ10sXG4gICAgICBhb3Q6IHRydWUsXG4gICAgICBvcHRpbWl6YXRpb246IHRydWUsXG4gICAgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcywgRGVmYXVsdFRpbWVvdXQgKiAyKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiBleHBlY3QoaG9zdC5zY29wZWRTeW5jKClcbiAgICAgICAgLmV4aXN0cyhqb2luKG91dHB1dFBhdGgsICdzcmMtYXBwLWxhenktbGF6eS1tb2R1bGUtbmdmYWN0b3J5LmpzJykpKVxuICAgICAgICAudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xufSk7XG4iXX0=