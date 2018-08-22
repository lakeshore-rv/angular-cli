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
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
const lazy_module_spec_large_1 = require("./lazy-module_spec_large");
describe('Browser Builder rebuilds', () => {
    const outputPath = core_1.normalize('dist');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('rebuilds on TS file changes', (done) => {
        const goldenValueFiles = {
            'src/app/app.module.ts': `
        import { BrowserModule } from '@angular/platform-browser';
        import { NgModule } from '@angular/core';

        import { AppComponent } from './app.component';

        @NgModule({
          declarations: [
            AppComponent
          ],
          imports: [
            BrowserModule
          ],
          providers: [],
          bootstrap: [AppComponent]
        })
        export class AppModule { }

        console.log('$$_E2E_GOLDEN_VALUE_1');
        export let X = '$$_E2E_GOLDEN_VALUE_2';
      `,
            'src/main.ts': `
        import { enableProdMode } from '@angular/core';
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

        import { AppModule } from './app/app.module';
        import { environment } from './environments/environment';

        if (environment.production) {
          enableProdMode();
        }

        platformBrowserDynamic().bootstrapModule(AppModule);

        import * as m from './app/app.module';
        console.log(m.X);
        console.log('$$_E2E_GOLDEN_VALUE_3');
      `,
        };
        const overrides = { watch: true };
        let buildNumber = 0;
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 3).pipe(
        // We must debounce on watch mode because file watchers are not very accurate.
        // Changes from just before a process runs can be picked up and cause rebuilds.
        // In this case, cleanup from the test right before this one causes a few rebuilds.
        operators_1.debounceTime(1000), operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            buildNumber += 1;
            switch (buildNumber) {
                case 1:
                    // No lazy chunk should exist.
                    expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, 'lazy-module.js'))).toBe(false);
                    // Write the lazy chunk files. Order matters when writing these, because of imports.
                    utils_1.host.writeMultipleFiles(lazy_module_spec_large_1.lazyModuleFiles);
                    utils_1.host.writeMultipleFiles(lazy_module_spec_large_1.lazyModuleImport);
                    break;
                case 2:
                    // A lazy chunk should have been with the filename.
                    expect(utils_1.host.scopedSync().exists(core_1.join(outputPath, 'lazy-lazy-module.js'))).toBe(true);
                    utils_1.host.writeMultipleFiles(goldenValueFiles);
                    break;
                case 3:
                    // The golden values should be present and in the right order.
                    const re = new RegExp(/\$\$_E2E_GOLDEN_VALUE_1(.|\n|\r)*/.source
                        + /\$\$_E2E_GOLDEN_VALUE_2(.|\n|\r)*/.source
                        + /\$\$_E2E_GOLDEN_VALUE_3/.source);
                    const fileName = './dist/main.js';
                    const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                    expect(content).toMatch(re);
                    break;
                default:
                    break;
            }
        }), operators_1.take(3)).toPromise().then(done, done.fail);
    });
    it('rebuilds on CSS changes', (done) => {
        const overrides = { watch: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 3).pipe(operators_1.debounceTime(500), operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => utils_1.host.appendToFile('src/app/app.component.css', ':host { color: blue; }')), operators_1.take(2)).toPromise().then(done, done.fail);
    });
    it('type checks on rebuilds', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/funky2.ts': `export const funky2 = (value: string) => value + 'hello';`,
            'src/funky.ts': `export * from './funky2';`,
        });
        utils_1.host.appendToFile('src/main.ts', `
      import { funky2 } from './funky';
      console.log(funky2('town'));
    `);
        const overrides = { watch: true, forkTypeChecker: false };
        const logger = new testing_1.TestLogger('rebuild-type-errors');
        const typeError = `is not assignable to parameter of type 'number'`;
        let buildNumber = 0;
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 3, logger).pipe(operators_1.debounceTime(1000), operators_1.tap((buildEvent) => {
            buildNumber += 1;
            switch (buildNumber) {
                case 1:
                    expect(buildEvent.success).toBe(true);
                    // Make an invalid version of the file.
                    // Should trigger a rebuild, this time an error is expected.
                    utils_1.host.writeMultipleFiles({
                        'src/funky2.ts': `export const funky2 = (value: number) => value + 1;`,
                    });
                    break;
                case 2:
                    // The second build should error out with a type error on the type of an argument.
                    expect(buildEvent.success).toBe(false);
                    expect(logger.includes(typeError)).toBe(true);
                    logger.clear();
                    // Change an UNRELATED file and the error should still happen.
                    // Should trigger a rebuild, this time an error is also expected.
                    utils_1.host.appendToFile('src/app/app.module.ts', `console.log(1);`);
                    break;
                case 3:
                    // The third build should have the same error as the first.
                    expect(buildEvent.success).toBe(false);
                    expect(logger.includes(typeError)).toBe(true);
                    logger.clear();
                    // Fix the error.
                    utils_1.host.writeMultipleFiles({
                        'src/funky2.ts': `export const funky2 = (value: string) => value + 'hello';`,
                    });
                    break;
                default:
                    expect(buildEvent.success).toBe(true);
                    break;
            }
        }), operators_1.take(4)).toPromise().then(done, done.fail);
    });
    it('rebuilds on type changes', (done) => {
        utils_1.host.writeMultipleFiles({ 'src/type.ts': `export type MyType = number;` });
        utils_1.host.appendToFile('src/main.ts', `import { MyType } from './type';`);
        const overrides = { watch: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 3).pipe(operators_1.debounceTime(1000), operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => utils_1.host.writeMultipleFiles({ 'src/type.ts': `export type MyType = string;` })), operators_1.take(2)).toPromise().then(done, done.fail);
    });
    it('rebuilds after errors in AOT', (done) => {
        // Save the original contents of `./src/app/app.component.ts`.
        const origContent = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize('src/app/app.component.ts')));
        // Add a major static analysis error on a non-main file to the initial build.
        utils_1.host.replaceInFile('./src/app/app.component.ts', `'app-root'`, `(() => 'app-root')()`);
        const overrides = { watch: true, aot: true, forkTypeChecker: false };
        const logger = new testing_1.TestLogger('rebuild-aot-errors');
        const staticAnalysisError = 'Function expressions are not supported in decorators';
        const syntaxError = 'Declaration or statement expected.';
        let buildNumber = 0;
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 3, logger).pipe(operators_1.debounceTime(1000), operators_1.tap((buildEvent) => {
            buildNumber += 1;
            switch (buildNumber) {
                case 1:
                    // The first build should error out with a static analysis error.
                    expect(buildEvent.success).toBe(false);
                    expect(logger.includes(staticAnalysisError)).toBe(true);
                    logger.clear();
                    // Fix the static analysis error.
                    utils_1.host.writeMultipleFiles({ 'src/app/app.component.ts': origContent });
                    break;
                case 2:
                    expect(buildEvent.success).toBe(true);
                    // Add an syntax error to a non-main file.
                    utils_1.host.appendToFile('src/app/app.component.ts', `]]]`);
                    break;
                case 3:
                    // The third build should have TS syntax error.
                    expect(buildEvent.success).toBe(false);
                    expect(logger.includes(syntaxError)).toBe(true);
                    logger.clear();
                    // Fix the syntax error, but add the static analysis error again.
                    utils_1.host.writeMultipleFiles({
                        'src/app/app.component.ts': origContent.replace(`'app-root'`, `(() => 'app-root')()`),
                    });
                    break;
                case 4:
                    expect(buildEvent.success).toBe(false);
                    // Restore the file to a error-less state.
                    utils_1.host.writeMultipleFiles({ 'src/app/app.component.ts': origContent });
                    break;
                case 5:
                    // The fifth build should have everything fixed..
                    expect(buildEvent.success).toBe(true);
                    expect(logger.includes(staticAnalysisError)).toBe(true);
                    break;
            }
        }), operators_1.take(5)).toPromise().then(done, done.fail);
    });
    it('rebuilds AOT factories', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/app/app.component.css': `
        @import './imported-styles.css';
        body {background-color: #00f;}
      `,
            'src/app/imported-styles.css': 'p {color: #f00;}',
        });
        const overrides = { watch: true, aot: true, forkTypeChecker: false };
        let buildNumber = 0;
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 3).pipe(operators_1.debounceTime(1000), operators_1.tap((buildEvent) => {
            buildNumber += 1;
            const fileName = './dist/main.js';
            let content;
            switch (buildNumber) {
                case 1:
                    // Trigger a few rebuilds first.
                    // The AOT compiler is still optimizing rebuilds on the first rebuilds.
                    expect(buildEvent.success).toBe(true);
                    utils_1.host.appendToFile('src/main.ts', 'console.log(1);');
                    break;
                case 2:
                    expect(buildEvent.success).toBe(true);
                    utils_1.host.appendToFile('src/main.ts', 'console.log(1);');
                    break;
                case 3:
                    // Change the component html.
                    expect(buildEvent.success).toBe(true);
                    utils_1.host.appendToFile('src/app/app.component.html', '<p>HTML_REBUILD_STRING<p>');
                    break;
                case 4:
                    // Check if html changes are added to factories.
                    expect(buildEvent.success).toBe(true);
                    content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                    expect(content).toContain('HTML_REBUILD_STRING');
                    // Change the component css.
                    utils_1.host.appendToFile('src/app/app.component.css', 'CSS_REBUILD_STRING {color: #f00;}');
                    break;
                case 5:
                    // Check if css changes are added to factories.
                    expect(buildEvent.success).toBe(true);
                    content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                    expect(content).toContain('CSS_REBUILD_STRING');
                    // Change the component css import.
                    utils_1.host.appendToFile('src/app/app.component.css', 'CSS_DEP_REBUILD_STRING {color: #f00;}');
                    break;
                case 6:
                    // Check if css import changes are added to factories.
                    expect(buildEvent.success).toBe(true);
                    content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                    expect(content).toContain('CSS_DEP_REBUILD_STRING');
                    // Change the component itself.
                    utils_1.host.replaceInFile('src/app/app.component.ts', 'app-root', 'app-root-FACTORY_REBUILD_STRING');
                    break;
                case 7:
                    // Check if component changes are added to factories.
                    expect(buildEvent.success).toBe(true);
                    content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                    expect(content).toContain('FACTORY_REBUILD_STRING');
                    break;
            }
        }), operators_1.take(7)).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVidWlsZF9zcGVjX2xhcmdlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9hbmd1bGFyL3Rlc3QvYnJvd3Nlci9yZWJ1aWxkX3NwZWNfbGFyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQzs7QUFFakMsK0RBQThGO0FBQzlGLCtDQUFrRTtBQUNsRSw4Q0FBeUQ7QUFDekQsb0NBQW1EO0FBQ25ELHFFQUE2RTtBQUc3RSxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLGdCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFckMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFHcEUsRUFBRSxDQUFDLDZCQUE2QixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDekMsTUFBTSxnQkFBZ0IsR0FBK0I7WUFDbkQsdUJBQXVCLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0J4QjtZQUNELGFBQWEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7OztPQWdCZDtTQUNGLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUVsQyxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFFcEIsdUJBQWEsQ0FBQyxZQUFJ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SyxDQUFDO29CQUNKLHFEQUFxRDtvQkFDckQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLE9BQU8sR0FBRyxnQkFBUyxDQUFDLGtCQUFrQixDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFDcEQsTUFBTTthQUNUO1FBQ0gsQ0FBQyxDQUFDLEVBQ0YsZ0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUixDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cblxuaW1wb3J0IHsgRGVmYXVsdFRpbWVvdXQsIFRlc3RMb2dnZXIsIHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIHRha2UsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGJyb3dzZXJUYXJnZXRTcGVjLCBob3N0IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgbGF6eU1vZHVsZUZpbGVzLCBsYXp5TW9kdWxlSW1wb3J0IH0gZnJvbSAnLi9sYXp5LW1vZHVsZV9zcGVjX2xhcmdlJztcblxuXG5kZXNjcmliZSgnQnJvd3NlciBCdWlsZGVyIHJlYnVpbGRzJywgKCkgPT4ge1xuICBjb25zdCBvdXRwdXRQYXRoID0gbm9ybWFsaXplKCdkaXN0Jyk7XG5cbiAgYmVmb3JlRWFjaChkb25lID0+IGhvc3QuaW5pdGlhbGl6ZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG4gIGFmdGVyRWFjaChkb25lID0+IGhvc3QucmVzdG9yZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cblxuICBpdCgncmVidWlsZHMgb24gVFMgZmlsZSBjaGFuZ2VzJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBnb2xkZW5WYWx1ZUZpbGVzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICdzcmMvYXBwL2FwcC5tb2R1bGUudHMnOiBgXG4gICAgICAgIGltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbiAgICAgICAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuXG4gICAgICAgIEBOZ01vZHVsZSh7XG4gICAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgICBBcHBDb21wb25lbnRcbiAgICAgICAgICBdLFxuICAgICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICAgIEJyb3dzZXJNb2R1bGVcbiAgICAgICAgICBdLFxuICAgICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgICAgYm9vdHN0cmFwOiBbQXBwQ29tcG9uZW50XVxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCckJF9FMkVfR09MREVOX1ZBTFVFXzEnKTtcbiAgICAgICAgZXhwb3J0IGxldCBYID0gJyQkX0UyRV9HT0xERU5fVkFMVUVfMic7XG4gICAgICBgLFxuICAgICAgJ3NyYy9tYWluLnRzJzogYFxuICAgICAgICBpbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljJztcblxuICAgICAgICBpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbiAgICAgICAgaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbiAgICAgICAgaWYgKGVudmlyb25tZW50LnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICBlbmFibGVQcm9kTW9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhdGZvcm1Ccm93c2VyRHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xuXG4gICAgICAgIGltcG9ydCAqIGFzIG0gZnJvbSAnLi9hcHAvYXBwLm1vZHVsZSc7XG4gICAgICAgIGNvbnNvbGUubG9nKG0uWCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCckJF9FMkVfR09MREVOX1ZBTFVFXzMnKTtcbiAgICAgIGAsXG4gICAgfTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUgfTtcblxuICAgIGxldCBidWlsZE51bWJlciA9IDA7XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMsIERlZmF1bHRUaW1lb3V0ICogMykucGlwZShcbiAgICAgIC8vIFdlIG11c3QgZGVib3VuY2Ugb24gd2F0Y2ggbW9kZSBiZWNhdXNlIGZpbGUgd2F0Y2hlcnMgYXJlIG5vdCB2ZXJ5IGFjY3VyYXRlLlxuICAgICAgLy8gQ2hhbmdlcyBmcm9tIGp1c3QgYmVmb3JlIGEgcHJvY2VzcyBydW5zIGNhbiBiZSBwaWNrZWQgdXAgYW5kIGNhdXNlIHJlYnVpbGRzLlxuICAgICAgLy8gSW4gdGhpcyBjYXNlLCBjbGVhbnVwIGZyb20gdGhlIHRlc3QgcmlnaHQgYmVmb3JlIHRoaXMgb25lIGNhdXNlcyBhIGZldyByZWJ1aWxkcy5cbiAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBidWlsZE51bWJlciArPSAxO1xuICAgICAgICBzd2l0Y2ggKGJ1aWxkTnVtYmVyKSB7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgLy8gTm8gbGF6eSBjaHVuayBzaG91bGQgZXhpc3QuXG4gICAgICAgICAgICBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKGpvaW4ob3V0cHV0UGF0aCwgJ2xhenktbW9kdWxlLmpzJykpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgIC8vIFdyaXRlIHRoZSBsYXp5IGNodW5rIGZpbGVzLiBPcmRlciBtYXR0ZXJzIHdoZW4gd3JpdGluZyB0aGVzZSwgYmVjYXVzZSBvZiBpbXBvcnRzLlxuICAgICAgICAgICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMobGF6eU1vZHVsZUZpbGVzKTtcbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKGxhenlNb2R1bGVJbXBvcnQpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAvLyBBIGxhenkgY2h1bmsgc2hvdWxkIGhhdmUgYmVlbiB3aXRoIHRoZSBmaWxlbmFtZS5cbiAgICAgICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMoam9pbihvdXRwdXRQYXRoLCAnbGF6eS1sYXp5LW1vZHVsZS5qcycpKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKGdvbGRlblZhbHVlRmlsZXMpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAvLyBUaGUgZ29sZGVuIHZhbHVlcyBzaG91bGQgYmUgcHJlc2VudCBhbmQgaW4gdGhlIHJpZ2h0IG9yZGVyLlxuICAgICAgICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgICAvXFwkXFwkX0UyRV9HT0xERU5fVkFMVUVfMSgufFxcbnxcXHIpKi8uc291cmNlXG4gICAgICAgICAgICAgICsgL1xcJFxcJF9FMkVfR09MREVOX1ZBTFVFXzIoLnxcXG58XFxyKSovLnNvdXJjZVxuICAgICAgICAgICAgICArIC9cXCRcXCRfRTJFX0dPTERFTl9WQUxVRV8zLy5zb3VyY2UsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnLi9kaXN0L21haW4uanMnO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoXG4gICAgICAgICAgICAgIGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2gocmUpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGFrZSgzKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoJ3JlYnVpbGRzIG9uIENTUyBjaGFuZ2VzJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IHdhdGNoOiB0cnVlIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMsIERlZmF1bHRUaW1lb3V0ICogMykucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSg1MDApLFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiBob3N0LmFwcGVuZFRvRmlsZSgnc3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcycsICc6aG9zdCB7IGNvbG9yOiBibHVlOyB9JykpLFxuICAgICAgdGFrZSgyKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoJ3R5cGUgY2hlY2tzIG9uIHJlYnVpbGRzJywgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL2Z1bmt5Mi50cyc6IGBleHBvcnQgY29uc3QgZnVua3kyID0gKHZhbHVlOiBzdHJpbmcpID0+IHZhbHVlICsgJ2hlbGxvJztgLFxuICAgICAgJ3NyYy9mdW5reS50cyc6IGBleHBvcnQgKiBmcm9tICcuL2Z1bmt5Mic7YCxcbiAgICB9KTtcbiAgICBob3N0LmFwcGVuZFRvRmlsZSgnc3JjL21haW4udHMnLCBgXG4gICAgICBpbXBvcnQgeyBmdW5reTIgfSBmcm9tICcuL2Z1bmt5JztcbiAgICAgIGNvbnNvbGUubG9nKGZ1bmt5MigndG93bicpKTtcbiAgICBgKTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUsIGZvcmtUeXBlQ2hlY2tlcjogZmFsc2UgfTtcbiAgICBjb25zdCBsb2dnZXIgPSBuZXcgVGVzdExvZ2dlcigncmVidWlsZC10eXBlLWVycm9ycycpO1xuICAgIGNvbnN0IHR5cGVFcnJvciA9IGBpcyBub3QgYXNzaWduYWJsZSB0byBwYXJhbWV0ZXIgb2YgdHlwZSAnbnVtYmVyJ2A7XG4gICAgbGV0IGJ1aWxkTnVtYmVyID0gMDtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcywgRGVmYXVsdFRpbWVvdXQgKiAzLCBsb2dnZXIpLnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMTAwMCksXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IHtcbiAgICAgICAgYnVpbGROdW1iZXIgKz0gMTtcbiAgICAgICAgc3dpdGNoIChidWlsZE51bWJlcikge1xuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICAvLyBNYWtlIGFuIGludmFsaWQgdmVyc2lvbiBvZiB0aGUgZmlsZS5cbiAgICAgICAgICAgIC8vIFNob3VsZCB0cmlnZ2VyIGEgcmVidWlsZCwgdGhpcyB0aW1lIGFuIGVycm9yIGlzIGV4cGVjdGVkLlxuICAgICAgICAgICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgICAgICAgICAnc3JjL2Z1bmt5Mi50cyc6IGBleHBvcnQgY29uc3QgZnVua3kyID0gKHZhbHVlOiBudW1iZXIpID0+IHZhbHVlICsgMTtgLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIC8vIFRoZSBzZWNvbmQgYnVpbGQgc2hvdWxkIGVycm9yIG91dCB3aXRoIGEgdHlwZSBlcnJvciBvbiB0aGUgdHlwZSBvZiBhbiBhcmd1bWVudC5cbiAgICAgICAgICAgIGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGxvZ2dlci5pbmNsdWRlcyh0eXBlRXJyb3IpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgbG9nZ2VyLmNsZWFyKCk7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgYW4gVU5SRUxBVEVEIGZpbGUgYW5kIHRoZSBlcnJvciBzaG91bGQgc3RpbGwgaGFwcGVuLlxuICAgICAgICAgICAgLy8gU2hvdWxkIHRyaWdnZXIgYSByZWJ1aWxkLCB0aGlzIHRpbWUgYW4gZXJyb3IgaXMgYWxzbyBleHBlY3RlZC5cbiAgICAgICAgICAgIGhvc3QuYXBwZW5kVG9GaWxlKCdzcmMvYXBwL2FwcC5tb2R1bGUudHMnLCBgY29uc29sZS5sb2coMSk7YCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIC8vIFRoZSB0aGlyZCBidWlsZCBzaG91bGQgaGF2ZSB0aGUgc2FtZSBlcnJvciBhcyB0aGUgZmlyc3QuXG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChsb2dnZXIuaW5jbHVkZXModHlwZUVycm9yKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGxvZ2dlci5jbGVhcigpO1xuICAgICAgICAgICAgLy8gRml4IHRoZSBlcnJvci5cbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICAgICAgICAgJ3NyYy9mdW5reTIudHMnOiBgZXhwb3J0IGNvbnN0IGZ1bmt5MiA9ICh2YWx1ZTogc3RyaW5nKSA9PiB2YWx1ZSArICdoZWxsbyc7YCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRha2UoNCksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdyZWJ1aWxkcyBvbiB0eXBlIGNoYW5nZXMnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHsgJ3NyYy90eXBlLnRzJzogYGV4cG9ydCB0eXBlIE15VHlwZSA9IG51bWJlcjtgIH0pO1xuICAgIGhvc3QuYXBwZW5kVG9GaWxlKCdzcmMvbWFpbi50cycsIGBpbXBvcnQgeyBNeVR5cGUgfSBmcm9tICcuL3R5cGUnO2ApO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0geyB3YXRjaDogdHJ1ZSB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzLCBEZWZhdWx0VGltZW91dCAqIDMpLnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMTAwMCksXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHsgJ3NyYy90eXBlLnRzJzogYGV4cG9ydCB0eXBlIE15VHlwZSA9IHN0cmluZztgIH0pKSxcbiAgICAgIHRha2UoMiksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG5cbiAgaXQoJ3JlYnVpbGRzIGFmdGVyIGVycm9ycyBpbiBBT1QnLCAoZG9uZSkgPT4ge1xuICAgIC8vIFNhdmUgdGhlIG9yaWdpbmFsIGNvbnRlbnRzIG9mIGAuL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50c2AuXG4gICAgY29uc3Qgb3JpZ0NvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKFxuICAgICAgaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cycpKSk7XG4gICAgLy8gQWRkIGEgbWFqb3Igc3RhdGljIGFuYWx5c2lzIGVycm9yIG9uIGEgbm9uLW1haW4gZmlsZSB0byB0aGUgaW5pdGlhbCBidWlsZC5cbiAgICBob3N0LnJlcGxhY2VJbkZpbGUoJy4vc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJywgYCdhcHAtcm9vdCdgLCBgKCgpID0+ICdhcHAtcm9vdCcpKClgKTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUsIGFvdDogdHJ1ZSwgZm9ya1R5cGVDaGVja2VyOiBmYWxzZSB9O1xuICAgIGNvbnN0IGxvZ2dlciA9IG5ldyBUZXN0TG9nZ2VyKCdyZWJ1aWxkLWFvdC1lcnJvcnMnKTtcbiAgICBjb25zdCBzdGF0aWNBbmFseXNpc0Vycm9yID0gJ0Z1bmN0aW9uIGV4cHJlc3Npb25zIGFyZSBub3Qgc3VwcG9ydGVkIGluIGRlY29yYXRvcnMnO1xuICAgIGNvbnN0IHN5bnRheEVycm9yID0gJ0RlY2xhcmF0aW9uIG9yIHN0YXRlbWVudCBleHBlY3RlZC4nO1xuICAgIGxldCBidWlsZE51bWJlciA9IDA7XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMsIERlZmF1bHRUaW1lb3V0ICogMywgbG9nZ2VyKS5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDEwMDApLFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiB7XG4gICAgICAgIGJ1aWxkTnVtYmVyICs9IDE7XG4gICAgICAgIHN3aXRjaCAoYnVpbGROdW1iZXIpIHtcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAvLyBUaGUgZmlyc3QgYnVpbGQgc2hvdWxkIGVycm9yIG91dCB3aXRoIGEgc3RhdGljIGFuYWx5c2lzIGVycm9yLlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QobG9nZ2VyLmluY2x1ZGVzKHN0YXRpY0FuYWx5c2lzRXJyb3IpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgbG9nZ2VyLmNsZWFyKCk7XG4gICAgICAgICAgICAvLyBGaXggdGhlIHN0YXRpYyBhbmFseXNpcyBlcnJvci5cbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHsgJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyc6IG9yaWdDb250ZW50IH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgLy8gQWRkIGFuIHN5bnRheCBlcnJvciB0byBhIG5vbi1tYWluIGZpbGUuXG4gICAgICAgICAgICBob3N0LmFwcGVuZFRvRmlsZSgnc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJywgYF1dXWApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAvLyBUaGUgdGhpcmQgYnVpbGQgc2hvdWxkIGhhdmUgVFMgc3ludGF4IGVycm9yLlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QobG9nZ2VyLmluY2x1ZGVzKHN5bnRheEVycm9yKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGxvZ2dlci5jbGVhcigpO1xuICAgICAgICAgICAgLy8gRml4IHRoZSBzeW50YXggZXJyb3IsIGJ1dCBhZGQgdGhlIHN0YXRpYyBhbmFseXNpcyBlcnJvciBhZ2Fpbi5cbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICAgICAgICAgJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyc6IG9yaWdDb250ZW50LnJlcGxhY2UoYCdhcHAtcm9vdCdgLCBgKCgpID0+ICdhcHAtcm9vdCcpKClgKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIGZpbGUgdG8gYSBlcnJvci1sZXNzIHN0YXRlLlxuICAgICAgICAgICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoeyAnc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJzogb3JpZ0NvbnRlbnQgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIC8vIFRoZSBmaWZ0aCBidWlsZCBzaG91bGQgaGF2ZSBldmVyeXRoaW5nIGZpeGVkLi5cbiAgICAgICAgICAgIGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QobG9nZ2VyLmluY2x1ZGVzKHN0YXRpY0FuYWx5c2lzRXJyb3IpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGFrZSg1KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cblxuICBpdCgncmVidWlsZHMgQU9UIGZhY3RvcmllcycsIChkb25lKSA9PiB7XG5cbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcyc6IGBcbiAgICAgICAgQGltcG9ydCAnLi9pbXBvcnRlZC1zdHlsZXMuY3NzJztcbiAgICAgICAgYm9keSB7YmFja2dyb3VuZC1jb2xvcjogIzAwZjt9XG4gICAgICBgLFxuICAgICAgJ3NyYy9hcHAvaW1wb3J0ZWQtc3R5bGVzLmNzcyc6ICdwIHtjb2xvcjogI2YwMDt9JyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUsIGFvdDogdHJ1ZSwgZm9ya1R5cGVDaGVja2VyOiBmYWxzZSB9O1xuICAgIGxldCBidWlsZE51bWJlciA9IDA7XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMsIERlZmF1bHRUaW1lb3V0ICogMykucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4ge1xuICAgICAgICBidWlsZE51bWJlciArPSAxO1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9ICcuL2Rpc3QvbWFpbi5qcyc7XG4gICAgICAgIGxldCBjb250ZW50O1xuICAgICAgICBzd2l0Y2ggKGJ1aWxkTnVtYmVyKSB7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgLy8gVHJpZ2dlciBhIGZldyByZWJ1aWxkcyBmaXJzdC5cbiAgICAgICAgICAgIC8vIFRoZSBBT1QgY29tcGlsZXIgaXMgc3RpbGwgb3B0aW1pemluZyByZWJ1aWxkcyBvbiB0aGUgZmlyc3QgcmVidWlsZHMuXG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgaG9zdC5hcHBlbmRUb0ZpbGUoJ3NyYy9tYWluLnRzJywgJ2NvbnNvbGUubG9nKDEpOycpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgaG9zdC5hcHBlbmRUb0ZpbGUoJ3NyYy9tYWluLnRzJywgJ2NvbnNvbGUubG9nKDEpOycpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAvLyBDaGFuZ2UgdGhlIGNvbXBvbmVudCBodG1sLlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGhvc3QuYXBwZW5kVG9GaWxlKCdzcmMvYXBwL2FwcC5jb21wb25lbnQuaHRtbCcsICc8cD5IVE1MX1JFQlVJTERfU1RSSU5HPHA+Jyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGh0bWwgY2hhbmdlcyBhcmUgYWRkZWQgdG8gZmFjdG9yaWVzLlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvQ29udGFpbignSFRNTF9SRUJVSUxEX1NUUklORycpO1xuICAgICAgICAgICAgLy8gQ2hhbmdlIHRoZSBjb21wb25lbnQgY3NzLlxuICAgICAgICAgICAgaG9zdC5hcHBlbmRUb0ZpbGUoJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MnLCAnQ1NTX1JFQlVJTERfU1RSSU5HIHtjb2xvcjogI2YwMDt9Jyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNzcyBjaGFuZ2VzIGFyZSBhZGRlZCB0byBmYWN0b3JpZXMuXG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgICAgICBleHBlY3QoY29udGVudCkudG9Db250YWluKCdDU1NfUkVCVUlMRF9TVFJJTkcnKTtcbiAgICAgICAgICAgIC8vIENoYW5nZSB0aGUgY29tcG9uZW50IGNzcyBpbXBvcnQuXG4gICAgICAgICAgICBob3N0LmFwcGVuZFRvRmlsZSgnc3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcycsICdDU1NfREVQX1JFQlVJTERfU1RSSU5HIHtjb2xvcjogI2YwMDt9Jyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNzcyBpbXBvcnQgY2hhbmdlcyBhcmUgYWRkZWQgdG8gZmFjdG9yaWVzLlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvQ29udGFpbignQ1NTX0RFUF9SRUJVSUxEX1NUUklORycpO1xuICAgICAgICAgICAgLy8gQ2hhbmdlIHRoZSBjb21wb25lbnQgaXRzZWxmLlxuICAgICAgICAgICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvYXBwL2FwcC5jb21wb25lbnQudHMnLCAnYXBwLXJvb3QnLFxuICAgICAgICAgICAgICAnYXBwLXJvb3QtRkFDVE9SWV9SRUJVSUxEX1NUUklORycpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBjb21wb25lbnQgY2hhbmdlcyBhcmUgYWRkZWQgdG8gZmFjdG9yaWVzLlxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvQ29udGFpbignRkFDVE9SWV9SRUJVSUxEX1NUUklORycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGFrZSg3KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG59KTtcbiJdfQ==