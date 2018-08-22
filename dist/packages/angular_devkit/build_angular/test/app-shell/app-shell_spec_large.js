"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-big-function
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/architect/testing");
const core_1 = require("@angular-devkit/core");
const express = require("express"); // tslint:disable-line:no-implicit-dependencies
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
describe('AppShell Builder', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    const targetSpec = { project: 'app', target: 'app-shell' };
    const appShellRouteFiles = {
        'src/app/app-shell/app-shell.component.html': `
      <p>
        app-shell works!
      </p>
    `,
        'src/app/app-shell/app-shell.component.ts': `
      import { Component, OnInit } from '@angular/core';

      @Component({
        selector: 'app-app-shell',
        templateUrl: './app-shell.component.html',
      })
      export class AppShellComponent implements OnInit {

        constructor() { }

        ngOnInit() {
        }

      }
    `,
        'src/app/app.module.ts': `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { environment } from '../environments/environment';
      import { RouterModule } from '@angular/router';

      @NgModule({
        declarations: [
          AppComponent
        ],
        imports: [
          BrowserModule.withServerTransition({ appId: 'serverApp' }),
          AppRoutingModule,
          RouterModule
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `,
        'src/app/app.server.module.ts': `
      import { NgModule } from '@angular/core';
      import { ServerModule } from '@angular/platform-server';

      import { AppModule } from './app.module';
      import { AppComponent } from './app.component';
      import { Routes, RouterModule } from '@angular/router';
      import { AppShellComponent } from './app-shell/app-shell.component';

      const routes: Routes = [ { path: 'shell', component: AppShellComponent }];

      @NgModule({
        imports: [
          AppModule,
          ServerModule,
          RouterModule.forRoot(routes),
        ],
        bootstrap: [AppComponent],
        declarations: [AppShellComponent],
      })
      export class AppServerModule {}
    `,
        'src/main.ts': `
      import { enableProdMode } from '@angular/core';
      import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

      import { AppModule } from './app/app.module';
      import { environment } from './environments/environment';

      if (environment.production) {
        enableProdMode();
      }

      document.addEventListener('DOMContentLoaded', () => {
        platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.log(err));
      });
    `,
        'src/app/app-routing.module.ts': `
      import { NgModule } from '@angular/core';
      import { Routes, RouterModule } from '@angular/router';

      const routes: Routes = [];

      @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
      })
      export class AppRoutingModule { }
    `,
        'src/app/app.component.html': `
      <router-outlet></router-outlet>
    `,
    };
    it('works (basic)', done => {
        utils_1.host.replaceInFile('src/app/app.module.ts', /    BrowserModule/, `
      BrowserModule.withServerTransition({ appId: 'some-app' })
    `);
        testing_1.runTargetSpec(utils_1.host, targetSpec, {}, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = 'dist/index.html';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(/Welcome to app!/);
        })).toPromise().then(done, done.fail);
    });
    it('works with route', done => {
        utils_1.host.writeMultipleFiles(appShellRouteFiles);
        const overrides = { route: 'shell' };
        testing_1.runTargetSpec(utils_1.host, targetSpec, overrides, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = 'dist/index.html';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toContain('app-shell works!');
        })).toPromise().then(done, done.fail);
    });
    it('works with route and service-worker', done => {
        utils_1.host.writeMultipleFiles(appShellRouteFiles);
        utils_1.host.writeMultipleFiles({
            'src/ngsw-config.json': `
        {
          "index": "/index.html",
          "assetGroups": [{
            "name": "app",
            "installMode": "prefetch",
            "resources": {
              "files": [
                "/favicon.ico",
                "/index.html",
                "/*.css",
                "/*.js"
              ]
            }
          }, {
            "name": "assets",
            "installMode": "lazy",
            "updateMode": "prefetch",
            "resources": {
              "files": [
                "/assets/**"
              ]
            }
          }]
        }
      `,
            'src/app/app.module.ts': `
        import { BrowserModule } from '@angular/platform-browser';
        import { NgModule } from '@angular/core';

        import { AppRoutingModule } from './app-routing.module';
        import { AppComponent } from './app.component';
        import { ServiceWorkerModule } from '@angular/service-worker';
        import { environment } from '../environments/environment';
        import { RouterModule } from '@angular/router';

        @NgModule({
          declarations: [
            AppComponent
          ],
          imports: [
            BrowserModule.withServerTransition({ appId: 'serverApp' }),
            AppRoutingModule,
            ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
            RouterModule
          ],
          providers: [],
          bootstrap: [AppComponent]
        })
        export class AppModule { }
      `,
            'e2e/app.e2e-spec.ts': `
        import { browser, by, element } from 'protractor';

        it('should have ngsw in normal state', () => {
          browser.get('/');
          // Wait for service worker to load.
          browser.sleep(2000);
          browser.waitForAngularEnabled(false);
          browser.get('/ngsw/state');
          // Should have updated, and be in normal state.
          expect(element(by.css('pre')).getText()).not.toContain('Last update check: never');
          expect(element(by.css('pre')).getText()).toContain('Driver state: NORMAL');
        });
      `,
        });
        // This should match the browser target prod config.
        utils_1.host.replaceInFile('angular.json', '"buildOptimizer": true', '"buildOptimizer": true, "serviceWorker": true');
        const overrides = { route: 'shell' };
        const prodTargetSpec = Object.assign({}, targetSpec, { configuration: 'production' });
        let server;
        // Build the app shell.
        testing_1.runTargetSpec(utils_1.host, prodTargetSpec, overrides, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), 
        // Make sure the index is pre-rendering the route.
        operators_1.tap(() => {
            const fileName = 'dist/index.html';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toContain('app-shell works!');
        }), operators_1.tap(() => {
            // Serve the app using a simple static server.
            const app = express();
            app.use('/', express.static(core_1.getSystemPath(core_1.join(utils_1.host.root(), 'dist')) + '/'));
            server = app.listen(4200);
        }), 
        // Load app in protractor, then check service worker status.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.protractorTargetSpec, { devServerTarget: undefined })), 
        // Close the express server.
        operators_1.tap(() => server.close())).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXNoZWxsX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9hcHAtc2hlbGwvYXBwLXNoZWxsX3NwZWNfbGFyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQzs7QUFFakMsK0RBQWtGO0FBQ2xGLCtDQUFpRjtBQUNqRixtQ0FBbUMsQ0FBQywrQ0FBK0M7QUFFbkYsOENBQWdEO0FBQ2hELG9DQUFzRDtBQUd0RCxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLE1BQU0sVUFBVSxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUM7SUFDM0QsTUFBTSxrQkFBa0IsR0FBRztRQUN6Qiw0Q0FBNEMsRUFBRTs7OztLQUk3QztRQUNELDBDQUEwQyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7S0FlM0M7UUFDRCx1QkFBdUIsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXNCeEI7UUFDRCw4QkFBOEIsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBcUIvQjtRQUNELGFBQWEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0tBZWQ7UUFDRCwrQkFBK0Is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QyxLQUFLLEVBQUUsQ0FBQyxDQUMxQixDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cblxuaW1wb3J0IHsgRGVmYXVsdFRpbWVvdXQsIHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgZ2V0U3lzdGVtUGF0aCwgam9pbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBjb25jYXRNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGhvc3QsIHByb3RyYWN0b3JUYXJnZXRTcGVjIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5cbmRlc2NyaWJlKCdBcHBTaGVsbCBCdWlsZGVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBjb25zdCB0YXJnZXRTcGVjID0geyBwcm9qZWN0OiAnYXBwJywgdGFyZ2V0OiAnYXBwLXNoZWxsJyB9O1xuICBjb25zdCBhcHBTaGVsbFJvdXRlRmlsZXMgPSB7XG4gICAgJ3NyYy9hcHAvYXBwLXNoZWxsL2FwcC1zaGVsbC5jb21wb25lbnQuaHRtbCc6IGBcbiAgICAgIDxwPlxuICAgICAgICBhcHAtc2hlbGwgd29ya3MhXG4gICAgICA8L3A+XG4gICAgYCxcbiAgICAnc3JjL2FwcC9hcHAtc2hlbGwvYXBwLXNoZWxsLmNvbXBvbmVudC50cyc6IGBcbiAgICAgIGltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbiAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICBzZWxlY3RvcjogJ2FwcC1hcHAtc2hlbGwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLXNoZWxsLmNvbXBvbmVudC5odG1sJyxcbiAgICAgIH0pXG4gICAgICBleHBvcnQgY2xhc3MgQXBwU2hlbGxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICAgICAgbmdPbkluaXQoKSB7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIGAsXG4gICAgJ3NyYy9hcHAvYXBwLm1vZHVsZS50cyc6IGBcbiAgICAgIGltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbiAgICAgIGltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbiAgICAgIGltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tICcuL2FwcC1yb3V0aW5nLm1vZHVsZSc7XG4gICAgICBpbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuICAgICAgaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuICAgICAgQE5nTW9kdWxlKHtcbiAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgICAgIF0sXG4gICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICBCcm93c2VyTW9kdWxlLndpdGhTZXJ2ZXJUcmFuc2l0aW9uKHsgYXBwSWQ6ICdzZXJ2ZXJBcHAnIH0pLFxuICAgICAgICAgIEFwcFJvdXRpbmdNb2R1bGUsXG4gICAgICAgICAgUm91dGVyTW9kdWxlXG4gICAgICAgIF0sXG4gICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICAgIH0pXG4gICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuICAgIGAsXG4gICAgJ3NyYy9hcHAvYXBwLnNlcnZlci5tb2R1bGUudHMnOiBgXG4gICAgICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgaW1wb3J0IHsgU2VydmVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJztcblxuICAgICAgaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSAnLi9hcHAubW9kdWxlJztcbiAgICAgIGltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XG4gICAgICBpbXBvcnQgeyBSb3V0ZXMsIFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG4gICAgICBpbXBvcnQgeyBBcHBTaGVsbENvbXBvbmVudCB9IGZyb20gJy4vYXBwLXNoZWxsL2FwcC1zaGVsbC5jb21wb25lbnQnO1xuXG4gICAgICBjb25zdCByb3V0ZXM6IFJvdXRlcyA9IFsgeyBwYXRoOiAnc2hlbGwnLCBjb21wb25lbnQ6IEFwcFNoZWxsQ29tcG9uZW50IH1dO1xuXG4gICAgICBATmdNb2R1bGUoe1xuICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgQXBwTW9kdWxlLFxuICAgICAgICAgIFNlcnZlck1vZHVsZSxcbiAgICAgICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpLFxuICAgICAgICBdLFxuICAgICAgICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdLFxuICAgICAgICBkZWNsYXJhdGlvbnM6IFtBcHBTaGVsbENvbXBvbmVudF0sXG4gICAgICB9KVxuICAgICAgZXhwb3J0IGNsYXNzIEFwcFNlcnZlck1vZHVsZSB7fVxuICAgIGAsXG4gICAgJ3NyYy9tYWluLnRzJzogYFxuICAgICAgaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgIGltcG9ydCB7IHBsYXRmb3JtQnJvd3NlckR5bmFtaWMgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMnO1xuXG4gICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgIGltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG4gICAgICBpZiAoZW52aXJvbm1lbnQucHJvZHVjdGlvbikge1xuICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgIH0pO1xuICAgIGAsXG4gICAgJ3NyYy9hcHAvYXBwLXJvdXRpbmcubW9kdWxlLnRzJzogYFxuICAgICAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgIGltcG9ydCB7IFJvdXRlcywgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuICAgICAgY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXTtcblxuICAgICAgQE5nTW9kdWxlKHtcbiAgICAgICAgaW1wb3J0czogW1JvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyldLFxuICAgICAgICBleHBvcnRzOiBbUm91dGVyTW9kdWxlXVxuICAgICAgfSlcbiAgICAgIGV4cG9ydCBjbGFzcyBBcHBSb3V0aW5nTW9kdWxlIHsgfVxuICAgIGAsXG4gICAgJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC5odG1sJzogYFxuICAgICAgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxuICAgIGAsXG4gIH07XG5cbiAgaXQoJ3dvcmtzIChiYXNpYyknLCBkb25lID0+IHtcbiAgICBob3N0LnJlcGxhY2VJbkZpbGUoJ3NyYy9hcHAvYXBwLm1vZHVsZS50cycsIC8gICAgQnJvd3Nlck1vZHVsZS8sIGBcbiAgICAgIEJyb3dzZXJNb2R1bGUud2l0aFNlcnZlclRyYW5zaXRpb24oeyBhcHBJZDogJ3NvbWUtYXBwJyB9KVxuICAgIGApO1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCB0YXJnZXRTcGVjLCB7fSwgRGVmYXVsdFRpbWVvdXQgKiAyKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gJ2Rpc3QvaW5kZXguaHRtbCc7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvV2VsY29tZSB0byBhcHAhLyk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIHdpdGggcm91dGUnLCBkb25lID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhhcHBTaGVsbFJvdXRlRmlsZXMpO1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgcm91dGU6ICdzaGVsbCcgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgdGFyZ2V0U3BlYywgb3ZlcnJpZGVzLCBEZWZhdWx0VGltZW91dCAqIDIpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnZGlzdC9pbmRleC5odG1sJztcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b0NvbnRhaW4oJ2FwcC1zaGVsbCB3b3JrcyEnKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgnd29ya3Mgd2l0aCByb3V0ZSBhbmQgc2VydmljZS13b3JrZXInLCBkb25lID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhhcHBTaGVsbFJvdXRlRmlsZXMpO1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvbmdzdy1jb25maWcuanNvbic6IGBcbiAgICAgICAge1xuICAgICAgICAgIFwiaW5kZXhcIjogXCIvaW5kZXguaHRtbFwiLFxuICAgICAgICAgIFwiYXNzZXRHcm91cHNcIjogW3tcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImFwcFwiLFxuICAgICAgICAgICAgXCJpbnN0YWxsTW9kZVwiOiBcInByZWZldGNoXCIsXG4gICAgICAgICAgICBcInJlc291cmNlc1wiOiB7XG4gICAgICAgICAgICAgIFwiZmlsZXNcIjogW1xuICAgICAgICAgICAgICAgIFwiL2Zhdmljb24uaWNvXCIsXG4gICAgICAgICAgICAgICAgXCIvaW5kZXguaHRtbFwiLFxuICAgICAgICAgICAgICAgIFwiLyouY3NzXCIsXG4gICAgICAgICAgICAgICAgXCIvKi5qc1wiXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJhc3NldHNcIixcbiAgICAgICAgICAgIFwiaW5zdGFsbE1vZGVcIjogXCJsYXp5XCIsXG4gICAgICAgICAgICBcInVwZGF0ZU1vZGVcIjogXCJwcmVmZXRjaFwiLFxuICAgICAgICAgICAgXCJyZXNvdXJjZXNcIjoge1xuICAgICAgICAgICAgICBcImZpbGVzXCI6IFtcbiAgICAgICAgICAgICAgICBcIi9hc3NldHMvKipcIlxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgYCxcbiAgICAgICdzcmMvYXBwL2FwcC5tb2R1bGUudHMnOiBgXG4gICAgICAgIGltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbiAgICAgICAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSAnLi9hcHAtcm91dGluZy5tb2R1bGUnO1xuICAgICAgICBpbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuICAgICAgICBpbXBvcnQgeyBTZXJ2aWNlV29ya2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvc2VydmljZS13b3JrZXInO1xuICAgICAgICBpbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG4gICAgICAgIGltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbiAgICAgICAgQE5nTW9kdWxlKHtcbiAgICAgICAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgICAgIEFwcENvbXBvbmVudFxuICAgICAgICAgIF0sXG4gICAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgICAgQnJvd3Nlck1vZHVsZS53aXRoU2VydmVyVHJhbnNpdGlvbih7IGFwcElkOiAnc2VydmVyQXBwJyB9KSxcbiAgICAgICAgICAgIEFwcFJvdXRpbmdNb2R1bGUsXG4gICAgICAgICAgICBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKCcvbmdzdy13b3JrZXIuanMnLCB7IGVuYWJsZWQ6IGVudmlyb25tZW50LnByb2R1Y3Rpb24gfSksXG4gICAgICAgICAgICBSb3V0ZXJNb2R1bGVcbiAgICAgICAgICBdLFxuICAgICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgICAgYm9vdHN0cmFwOiBbQXBwQ29tcG9uZW50XVxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuICAgICAgYCxcbiAgICAgICdlMmUvYXBwLmUyZS1zcGVjLnRzJzogYFxuICAgICAgICBpbXBvcnQgeyBicm93c2VyLCBieSwgZWxlbWVudCB9IGZyb20gJ3Byb3RyYWN0b3InO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBuZ3N3IGluIG5vcm1hbCBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgICBicm93c2VyLmdldCgnLycpO1xuICAgICAgICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIHRvIGxvYWQuXG4gICAgICAgICAgYnJvd3Nlci5zbGVlcCgyMDAwKTtcbiAgICAgICAgICBicm93c2VyLndhaXRGb3JBbmd1bGFyRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICAgYnJvd3Nlci5nZXQoJy9uZ3N3L3N0YXRlJyk7XG4gICAgICAgICAgLy8gU2hvdWxkIGhhdmUgdXBkYXRlZCwgYW5kIGJlIGluIG5vcm1hbCBzdGF0ZS5cbiAgICAgICAgICBleHBlY3QoZWxlbWVudChieS5jc3MoJ3ByZScpKS5nZXRUZXh0KCkpLm5vdC50b0NvbnRhaW4oJ0xhc3QgdXBkYXRlIGNoZWNrOiBuZXZlcicpO1xuICAgICAgICAgIGV4cGVjdChlbGVtZW50KGJ5LmNzcygncHJlJykpLmdldFRleHQoKSkudG9Db250YWluKCdEcml2ZXIgc3RhdGU6IE5PUk1BTCcpO1xuICAgICAgICB9KTtcbiAgICAgIGAsXG4gICAgfSk7XG4gICAgLy8gVGhpcyBzaG91bGQgbWF0Y2ggdGhlIGJyb3dzZXIgdGFyZ2V0IHByb2QgY29uZmlnLlxuICAgIGhvc3QucmVwbGFjZUluRmlsZShcbiAgICAgICdhbmd1bGFyLmpzb24nLFxuICAgICAgJ1wiYnVpbGRPcHRpbWl6ZXJcIjogdHJ1ZScsXG4gICAgICAnXCJidWlsZE9wdGltaXplclwiOiB0cnVlLCBcInNlcnZpY2VXb3JrZXJcIjogdHJ1ZScsXG4gICAgKTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgcm91dGU6ICdzaGVsbCcgfTtcbiAgICBjb25zdCBwcm9kVGFyZ2V0U3BlYyA9IHsgLi4udGFyZ2V0U3BlYywgY29uZmlndXJhdGlvbjogJ3Byb2R1Y3Rpb24nIH07XG4gICAgbGV0IHNlcnZlcjogU2VydmVyO1xuXG4gICAgLy8gQnVpbGQgdGhlIGFwcCBzaGVsbC5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIHByb2RUYXJnZXRTcGVjLCBvdmVycmlkZXMsIERlZmF1bHRUaW1lb3V0ICogMikucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICAvLyBNYWtlIHN1cmUgdGhlIGluZGV4IGlzIHByZS1yZW5kZXJpbmcgdGhlIHJvdXRlLlxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnZGlzdC9pbmRleC5odG1sJztcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b0NvbnRhaW4oJ2FwcC1zaGVsbCB3b3JrcyEnKTtcbiAgICAgIH0pLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgLy8gU2VydmUgdGhlIGFwcCB1c2luZyBhIHNpbXBsZSBzdGF0aWMgc2VydmVyLlxuICAgICAgICBjb25zdCBhcHAgPSBleHByZXNzKCk7XG4gICAgICAgIGFwcC51c2UoJy8nLCBleHByZXNzLnN0YXRpYyhnZXRTeXN0ZW1QYXRoKGpvaW4oaG9zdC5yb290KCksICdkaXN0JykpICsgJy8nKSk7XG4gICAgICAgIHNlcnZlciA9IGFwcC5saXN0ZW4oNDIwMCk7XG4gICAgICB9KSxcbiAgICAgIC8vIExvYWQgYXBwIGluIHByb3RyYWN0b3IsIHRoZW4gY2hlY2sgc2VydmljZSB3b3JrZXIgc3RhdHVzLlxuICAgICAgY29uY2F0TWFwKCgpID0+IHJ1blRhcmdldFNwZWMoaG9zdCwgcHJvdHJhY3RvclRhcmdldFNwZWMsIHsgZGV2U2VydmVyVGFyZ2V0OiB1bmRlZmluZWQgfSkpLFxuICAgICAgLy8gQ2xvc2UgdGhlIGV4cHJlc3Mgc2VydmVyLlxuICAgICAgdGFwKCgpID0+IHNlcnZlci5jbG9zZSgpKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG59KTtcbiJdfQ==