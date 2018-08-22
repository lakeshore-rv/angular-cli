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
describe('Browser Builder styles', () => {
    const extensionsWithImportSupport = ['css', 'scss', 'less', 'styl'];
    const extensionsWithVariableSupport = ['scss', 'less', 'styl'];
    const imgSvg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>
  `;
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('supports global styles', (done) => {
        const styles = {
            'src/string-style.css': '.string-style { color: red }',
            'src/input-style.css': '.input-style { color: red }',
            'src/lazy-style.css': '.lazy-style { color: red }',
            'src/pre-rename-style.css': '.pre-rename-style { color: red }',
            'src/pre-rename-lazy-style.css': '.pre-rename-lazy-style { color: red }',
        };
        const getStylesOption = () => [
            'src/input-style.css',
            { input: 'src/lazy-style.css', bundleName: 'lazy-style', lazy: true },
            { input: 'src/pre-rename-style.css', bundleName: 'renamed-style' },
            { input: 'src/pre-rename-lazy-style.css', bundleName: 'renamed-lazy-style', lazy: true },
        ];
        const cssMatches = {
            './dist/styles.css': '.input-style',
            './dist/lazy-style.css': '.lazy-style',
            './dist/renamed-style.css': '.pre-rename-style',
            './dist/renamed-lazy-style.css': '.pre-rename-lazy-style',
        };
        const cssIndexMatches = {
            './dist/index.html': '<link rel="stylesheet" href="styles.css">'
                + '<link rel="stylesheet" href="renamed-style.css">',
        };
        const jsMatches = {
            './dist/styles.js': '.input-style',
            './dist/lazy-style.js': '.lazy-style',
            './dist/renamed-style.js': '.pre-rename-style',
            './dist/renamed-lazy-style.js': '.pre-rename-lazy-style',
        };
        const jsIndexMatches = {
            './dist/index.html': '<script type="text/javascript" src="runtime.js"></script>'
                + '<script type="text/javascript" src="polyfills.js"></script>'
                + '<script type="text/javascript" src="styles.js"></script>'
                + '<script type="text/javascript" src="renamed-style.js"></script>'
                + '<script type="text/javascript" src="vendor.js"></script>'
                + '<script type="text/javascript" src="main.js"></script>',
        };
        utils_1.host.writeMultipleFiles(styles);
        const overrides = { extractCss: true, styles: getStylesOption() };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), 
        // Check css files were created.
        operators_1.tap(() => Object.keys(cssMatches).forEach(fileName => {
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(cssMatches[fileName]);
        })), 
        // Check no js files are created.
        operators_1.tap(() => Object.keys(jsMatches).forEach(key => expect(utils_1.host.scopedSync().exists(core_1.normalize(key))).toBe(false))), 
        // Check check index has styles in the right order.
        operators_1.tap(() => Object.keys(cssIndexMatches).forEach(fileName => {
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(cssIndexMatches[fileName]);
        })), 
        // Also test with extractCss false.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { extractCss: false, styles: getStylesOption() })), 
        // TODO: figure out why adding this tap breaks typings.
        // This also happens in the output-hashing spec.
        // tap((buildEvent) => expect(buildEvent.success).toBe(true)),
        // Check js files were created.
        operators_1.tap(() => Object.keys(jsMatches).forEach(fileName => {
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(jsMatches[fileName]);
        })), 
        // Check no css files are created.
        operators_1.tap(() => Object.keys(cssMatches).forEach(key => expect(utils_1.host.scopedSync().exists(core_1.normalize(key))).toBe(false))), 
        // Check check index has styles in the right order.
        operators_1.tap(() => Object.keys(jsIndexMatches).forEach(fileName => {
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(jsIndexMatches[fileName]);
        }))).toPromise().then(done, done.fail);
    });
    it('supports empty styleUrls in components', (done) => {
        utils_1.host.writeMultipleFiles({
            './src/app/app.component.ts': `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: []
        })
        export class AppComponent {
          title = 'app';
        }
      `,
        });
        const overrides = { extractCss: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
    extensionsWithImportSupport.forEach(ext => {
        it(`supports imports in ${ext} files`, (done) => {
            utils_1.host.writeMultipleFiles({
                [`src/styles.${ext}`]: `
          @import './imported-styles.${ext}';
          body { background-color: #00f; }
        `,
                [`src/imported-styles.${ext}`]: 'p { background-color: #f00; }',
                [`src/app/app.component.${ext}`]: `
          @import './imported-component-styles.${ext}';
          .outer {
            .inner {
              background: #fff;
            }
          }
        `,
                [`src/app/imported-component-styles.${ext}`]: 'h1 { background: #000; }',
            });
            const matches = {
                'dist/styles.css': new RegExp(
                // The global style should be there
                /p\s*{\s*background-color: #f00;\s*}(.|\n|\r)*/.source
                    // The global style via import should be there
                    + /body\s*{\s*background-color: #00f;\s*}/.source),
                'dist/styles.css.map': /"mappings":".+"/,
                'dist/main.js': new RegExp(
                // The component style should be there
                /h1(.|\n|\r)*background:\s*#000(.|\n|\r)*/.source
                    // The component style via import should be there
                    + /.outer(.|\n|\r)*.inner(.|\n|\r)*background:\s*#[fF]+/.source),
            };
            const overrides = {
                extractCss: true,
                sourceMap: true,
                styles: [`src/styles.${ext}`],
            };
            utils_1.host.replaceInFile('src/app/app.component.ts', './app.component.css', `./app.component.${ext}`);
            testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => Object.keys(matches).forEach(fileName => {
                const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                expect(content).toMatch(matches[fileName]);
            }))).toPromise().then(done, done.fail);
        });
    });
    extensionsWithImportSupport.forEach(ext => {
        it(`supports material imports in ${ext} files`, (done) => {
            utils_1.host.writeMultipleFiles({
                [`src/styles.${ext}`]: `
          @import "~@angular/material/prebuilt-themes/indigo-pink.css";
          @import "@angular/material/prebuilt-themes/indigo-pink.css";
        `,
                [`src/app/app.component.${ext}`]: `
          @import "~@angular/material/prebuilt-themes/indigo-pink.css";
          @import "@angular/material/prebuilt-themes/indigo-pink.css";
        `,
            });
            utils_1.host.replaceInFile('src/app/app.component.ts', './app.component.css', `./app.component.${ext}`);
            const overrides = {
                extractCss: true,
                styles: [{ input: `src/styles.${ext}` }],
            };
            testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
        });
    });
    it(`supports material icons`, (done) => {
        const overrides = {
            extractCss: true,
            optimization: true,
            styles: [
                { input: '../../../../node_modules/material-design-icons/iconfont/material-icons.css' },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
    extensionsWithVariableSupport.forEach(ext => {
        it(`supports ${ext} includePaths`, (done) => {
            let variableAssignment = '';
            let variablereference = '';
            if (ext === 'scss') {
                variableAssignment = '$primary-color:';
                variablereference = '$primary-color';
            }
            else if (ext === 'styl') {
                variableAssignment = '$primary-color =';
                variablereference = '$primary-color';
            }
            else if (ext === 'less') {
                variableAssignment = '@primary-color:';
                variablereference = '@primary-color';
            }
            utils_1.host.writeMultipleFiles({
                [`src/style-paths/variables.${ext}`]: `${variableAssignment} #f00;`,
                [`src/styles.${ext}`]: `
          @import 'variables';
          h1 { color: ${variablereference}; }
        `,
                [`src/app/app.component.${ext}`]: `
          @import 'variables';
          h2 { color: ${variablereference}; }
        `,
            });
            const matches = {
                'dist/styles.css': /h1\s*{\s*color: #f00;\s*}/,
                'dist/main.js': /h2.*{.*color: #f00;.*}/,
            };
            utils_1.host.replaceInFile('src/app/app.component.ts', './app.component.css', `./app.component.${ext}`);
            const overrides = {
                extractCss: true,
                styles: [`src/styles.${ext}`],
                stylePreprocessorOptions: {
                    includePaths: ['src/style-paths'],
                },
            };
            testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => Object.keys(matches).forEach(fileName => {
                const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
                expect(content).toMatch(matches[fileName]);
            }))).toPromise().then(done, done.fail);
        });
    });
    it('inlines resources', (done) => {
        utils_1.host.copyFile('src/spectrum.png', 'src/large.png');
        utils_1.host.writeMultipleFiles({
            'src/styles.scss': `
        h1 { background: url('./large.png'),
                         linear-gradient(to bottom, #0e40fa 25%, #0654f4 75%); }
        h2 { background: url('./small.svg'); }
        p  { background: url(./small-id.svg#testID); }
      `,
            'src/app/app.component.css': `
        h3 { background: url('../small.svg'); }
        h4 { background: url("../large.png"); }
      `,
            'src/small.svg': imgSvg,
            'src/small-id.svg': imgSvg,
        });
        const overrides = {
            aot: true,
            extractCss: true,
            styles: [`src/styles.scss`],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = 'dist/styles.css';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            // Large image should not be inlined, and gradient should be there.
            expect(content).toMatch(/url\(['"]?large\.png['"]?\),\s+linear-gradient\(to bottom, #0e40fa 25%, #0654f4 75%\);/);
            // Small image should be inlined.
            expect(content).toMatch(/url\(\\?['"]data:image\/svg\+xml/);
            // Small image with param should not be inlined.
            expect(content).toMatch(/url\(['"]?small-id\.svg#testID['"]?\)/);
        }), operators_1.tap(() => {
            const fileName = 'dist/main.js';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            // Large image should not be inlined.
            expect(content).toMatch(/url\((?:['"]|\\')?large\.png(?:['"]|\\')?\)/);
            // Small image should be inlined.
            expect(content).toMatch(/url\(\\?['"]data:image\/svg\+xml/);
        }), operators_1.tap(() => {
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/small.svg'))).toBe(false);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/large.png'))).toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/small-id.svg'))).toBe(true);
        })).toPromise().then(done, done.fail);
    });
    it(`supports font-awesome imports`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/styles.scss': `
        $fa-font-path: "~font-awesome/fonts";
        @import "~font-awesome/scss/font-awesome";
      `,
        });
        const overrides = { extractCss: true, styles: [`src/styles.scss`] };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    }, 30000);
    it(`uses autoprefixer`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/styles.css': core_1.tags.stripIndents `
        /* normal-comment */
        /*! important-comment */
        div { flex: 1 }`,
        });
        const overrides = { extractCss: true, optimization: false };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = 'dist/styles.css';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toContain(core_1.tags.stripIndents `
          /* normal-comment */
          /*! important-comment */
          div { -ms-flex: 1; flex: 1 }`);
        })).toPromise().then(done, done.fail);
    });
    it(`minimizes css`, (done) => {
        utils_1.host.writeMultipleFiles({
            'src/styles.css': core_1.tags.stripIndents `
        /* normal-comment */
        /*! important-comment */
        div { flex: 1 }`,
        });
        const overrides = { extractCss: true, optimization: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = 'dist/styles.css';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toContain('/*! important-comment */div{-ms-flex:1;flex:1}');
        })).toPromise().then(done, done.fail);
    });
    // TODO: consider making this a unit test in the url processing plugins.
    it(`supports baseHref and deployUrl in resource urls`, (done) => {
        // Use a large image for the relative ref so it cannot be inlined.
        utils_1.host.copyFile('src/spectrum.png', './src/assets/global-img-relative.png');
        utils_1.host.copyFile('src/spectrum.png', './src/assets/component-img-relative.png');
        utils_1.host.writeMultipleFiles({
            'src/styles.css': `
        h1 { background: url('/assets/global-img-absolute.svg'); }
        h2 { background: url('./assets/global-img-relative.png'); }
      `,
            'src/app/app.component.css': `
        h3 { background: url('/assets/component-img-absolute.svg'); }
        h4 { background: url('../assets/component-img-relative.png'); }
      `,
            // Use a small SVG for the absolute image to help validate that it is being referenced,
            // because it is so small it would be inlined usually.
            'src/assets/global-img-absolute.svg': imgSvg,
            'src/assets/component-img-absolute.svg': imgSvg,
        });
        const stylesBundle = 'dist/styles.css';
        const mainBundle = 'dist/main.js';
        // Check base paths are correctly generated.
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { aot: true, extractCss: true }).pipe(operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles).toContain(`url('/assets/global-img-absolute.svg')`);
            expect(styles).toContain(`url('global-img-relative.png')`);
            expect(main).toContain(`url('/assets/component-img-absolute.svg')`);
            expect(main).toContain(`url('component-img-relative.png')`);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/global-img-absolute.svg')))
                .toBe(false);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/global-img-relative.png')))
                .toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/component-img-absolute.svg')))
                .toBe(false);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/component-img-relative.png')))
                .toBe(true);
        }), 
        // Check urls with deploy-url scheme are used as is.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { extractCss: true, baseHref: '/base/', deployUrl: 'http://deploy.url/' })), operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles)
                .toContain(`url('http://deploy.url/assets/global-img-absolute.svg')`);
            expect(main)
                .toContain(`url('http://deploy.url/assets/component-img-absolute.svg')`);
        }), 
        // Check urls with base-href scheme are used as is (with deploy-url).
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { extractCss: true, baseHref: 'http://base.url/', deployUrl: 'deploy/' })), operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles)
                .toContain(`url('http://base.url/deploy/assets/global-img-absolute.svg')`);
            expect(main)
                .toContain(`url('http://base.url/deploy/assets/component-img-absolute.svg')`);
        }), 
        // Check urls with deploy-url and base-href scheme only use deploy-url.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, {
            extractCss: true,
            baseHref: 'http://base.url/',
            deployUrl: 'http://deploy.url/',
        })), operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles).toContain(`url('http://deploy.url/assets/global-img-absolute.svg')`);
            expect(main).toContain(`url('http://deploy.url/assets/component-img-absolute.svg')`);
        }), 
        // Check with schemeless base-href and deploy-url flags.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { extractCss: true, baseHref: '/base/', deployUrl: 'deploy/' })), operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles).toContain(`url('/base/deploy/assets/global-img-absolute.svg')`);
            expect(main).toContain(`url('/base/deploy/assets/component-img-absolute.svg')`);
        }), 
        // Check with identical base-href and deploy-url flags.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { extractCss: true, baseHref: '/base/', deployUrl: '/base/' })), operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles).toContain(`url('/base/assets/global-img-absolute.svg')`);
            expect(main).toContain(`url('/base/assets/component-img-absolute.svg')`);
        }), 
        // Check with only base-href flag.
        operators_1.concatMap(() => testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, { extractCss: true, baseHref: '/base/' })), operators_1.tap(() => {
            const styles = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(stylesBundle)));
            const main = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(mainBundle)));
            expect(styles).toContain(`url('/base/assets/global-img-absolute.svg')`);
            expect(main).toContain(`url('/base/assets/component-img-absolute.svg')`);
        })).toPromise().then(done, done.fail);
    }, 90000);
    it(`supports bootstrap@4`, (done) => {
        const overrides = {
            extractCss: true,
            styles: ['../../../../node_modules/bootstrap/dist/css/bootstrap.css'],
            scripts: ['../../../../node_modules/bootstrap/dist/js/bootstrap.js'],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVzX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9icm93c2VyL3N0eWxlc19zcGVjX2xhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7O0FBRWpDLCtEQUFrRjtBQUNsRiwrQ0FBa0U7QUFDbEUsOENBQWdEO0FBQ2hELG9DQUFtRDtBQUduRCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRSxNQUFNLDZCQUE2QixHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvRCxNQUFNLE1BQU0sR0FBRzs7OztHQUlkLENBQUM7SUFFRixVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNwQyxNQUFNLE1BQU0sR0FBK0I7WUFDekMsc0JBQXNCLEVBQUUsOEJBQThCO1lBQ3RELHFCQUFxQixFQUFFLDZCQUE2QjtZQUNwRCxvQkFBb0IsRUFBRSw0QkFBNEI7WUFDbEQsMEJBQTBC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QUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMzRCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cblxuaW1wb3J0IHsgRGVmYXVsdFRpbWVvdXQsIHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgbm9ybWFsaXplLCB0YWdzLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBjb25jYXRNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGJyb3dzZXJUYXJnZXRTcGVjLCBob3N0IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5cbmRlc2NyaWJlKCdCcm93c2VyIEJ1aWxkZXIgc3R5bGVzJywgKCkgPT4ge1xuICBjb25zdCBleHRlbnNpb25zV2l0aEltcG9ydFN1cHBvcnQgPSBbJ2NzcycsICdzY3NzJywgJ2xlc3MnLCAnc3R5bCddO1xuICBjb25zdCBleHRlbnNpb25zV2l0aFZhcmlhYmxlU3VwcG9ydCA9IFsnc2NzcycsICdsZXNzJywgJ3N0eWwnXTtcbiAgY29uc3QgaW1nU3ZnID0gYFxuICAgIDxzdmcgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjQwXCIgc3Ryb2tlPVwiZ3JlZW5cIiBzdHJva2Utd2lkdGg9XCI0XCIgZmlsbD1cInllbGxvd1wiIC8+XG4gICAgPC9zdmc+XG4gIGA7XG5cbiAgYmVmb3JlRWFjaChkb25lID0+IGhvc3QuaW5pdGlhbGl6ZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG4gIGFmdGVyRWFjaChkb25lID0+IGhvc3QucmVzdG9yZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cbiAgaXQoJ3N1cHBvcnRzIGdsb2JhbCBzdHlsZXMnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHN0eWxlczogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnc3JjL3N0cmluZy1zdHlsZS5jc3MnOiAnLnN0cmluZy1zdHlsZSB7IGNvbG9yOiByZWQgfScsXG4gICAgICAnc3JjL2lucHV0LXN0eWxlLmNzcyc6ICcuaW5wdXQtc3R5bGUgeyBjb2xvcjogcmVkIH0nLFxuICAgICAgJ3NyYy9sYXp5LXN0eWxlLmNzcyc6ICcubGF6eS1zdHlsZSB7IGNvbG9yOiByZWQgfScsXG4gICAgICAnc3JjL3ByZS1yZW5hbWUtc3R5bGUuY3NzJzogJy5wcmUtcmVuYW1lLXN0eWxlIHsgY29sb3I6IHJlZCB9JyxcbiAgICAgICdzcmMvcHJlLXJlbmFtZS1sYXp5LXN0eWxlLmNzcyc6ICcucHJlLXJlbmFtZS1sYXp5LXN0eWxlIHsgY29sb3I6IHJlZCB9JyxcbiAgICB9O1xuICAgIGNvbnN0IGdldFN0eWxlc09wdGlvbiA9ICgpID0+IFtcbiAgICAgICdzcmMvaW5wdXQtc3R5bGUuY3NzJyxcbiAgICAgIHsgaW5wdXQ6ICdzcmMvbGF6eS1zdHlsZS5jc3MnLCBidW5kbGVOYW1lOiAnbGF6eS1zdHlsZScsIGxhenk6IHRydWUgfSxcbiAgICAgIHsgaW5wdXQ6ICdzcmMvcHJlLXJlbmFtZS1zdHlsZS5jc3MnLCBidW5kbGVOYW1lOiAncmVuYW1lZC1zdHlsZScgfSxcbiAgICAgIHsgaW5wdXQ6ICdzcmMvcHJlLXJlbmFtZS1sYXp5LXN0eWxlLmNzcycsIGJ1bmRsZU5hbWU6ICdyZW5hbWVkLWxhenktc3R5bGUnLCBsYXp5OiB0cnVlIH0sXG4gICAgXTtcbiAgICBjb25zdCBjc3NNYXRjaGVzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICcuL2Rpc3Qvc3R5bGVzLmNzcyc6ICcuaW5wdXQtc3R5bGUnLFxuICAgICAgJy4vZGlzdC9sYXp5LXN0eWxlLmNzcyc6ICcubGF6eS1zdHlsZScsXG4gICAgICAnLi9kaXN0L3JlbmFtZWQtc3R5bGUuY3NzJzogJy5wcmUtcmVuYW1lLXN0eWxlJyxcbiAgICAgICcuL2Rpc3QvcmVuYW1lZC1sYXp5LXN0eWxlLmNzcyc6ICcucHJlLXJlbmFtZS1sYXp5LXN0eWxlJyxcbiAgICB9O1xuICAgIGNvbnN0IGNzc0luZGV4TWF0Y2hlczogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnLi9kaXN0L2luZGV4Lmh0bWwnOiAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJzdHlsZXMuY3NzXCI+J1xuICAgICAgICArICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cInJlbmFtZWQtc3R5bGUuY3NzXCI+JyxcbiAgICB9O1xuICAgIGNvbnN0IGpzTWF0Y2hlczogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnLi9kaXN0L3N0eWxlcy5qcyc6ICcuaW5wdXQtc3R5bGUnLFxuICAgICAgJy4vZGlzdC9sYXp5LXN0eWxlLmpzJzogJy5sYXp5LXN0eWxlJyxcbiAgICAgICcuL2Rpc3QvcmVuYW1lZC1zdHlsZS5qcyc6ICcucHJlLXJlbmFtZS1zdHlsZScsXG4gICAgICAnLi9kaXN0L3JlbmFtZWQtbGF6eS1zdHlsZS5qcyc6ICcucHJlLXJlbmFtZS1sYXp5LXN0eWxlJyxcbiAgICB9O1xuICAgIGNvbnN0IGpzSW5kZXhNYXRjaGVzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICcuL2Rpc3QvaW5kZXguaHRtbCc6ICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJydW50aW1lLmpzXCI+PC9zY3JpcHQ+J1xuICAgICAgICArICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJwb2x5ZmlsbHMuanNcIj48L3NjcmlwdD4nXG4gICAgICAgICsgJzxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cInN0eWxlcy5qc1wiPjwvc2NyaXB0PidcbiAgICAgICAgKyAnPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwicmVuYW1lZC1zdHlsZS5qc1wiPjwvc2NyaXB0PidcbiAgICAgICAgKyAnPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwidmVuZG9yLmpzXCI+PC9zY3JpcHQ+J1xuICAgICAgICArICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJtYWluLmpzXCI+PC9zY3JpcHQ+JyxcbiAgICB9O1xuXG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoc3R5bGVzKTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgZXh0cmFjdENzczogdHJ1ZSwgc3R5bGVzOiBnZXRTdHlsZXNPcHRpb24oKSB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIC8vIENoZWNrIGNzcyBmaWxlcyB3ZXJlIGNyZWF0ZWQuXG4gICAgICB0YXAoKCkgPT4gT2JqZWN0LmtleXMoY3NzTWF0Y2hlcykuZm9yRWFjaChmaWxlTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaChjc3NNYXRjaGVzW2ZpbGVOYW1lXSk7XG4gICAgICB9KSksXG4gICAgICAvLyBDaGVjayBubyBqcyBmaWxlcyBhcmUgY3JlYXRlZC5cbiAgICAgIHRhcCgoKSA9PiBPYmplY3Qua2V5cyhqc01hdGNoZXMpLmZvckVhY2goa2V5ID0+XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKGtleSkpKS50b0JlKGZhbHNlKSxcbiAgICAgICkpLFxuICAgICAgLy8gQ2hlY2sgY2hlY2sgaW5kZXggaGFzIHN0eWxlcyBpbiB0aGUgcmlnaHQgb3JkZXIuXG4gICAgICB0YXAoKCkgPT4gT2JqZWN0LmtleXMoY3NzSW5kZXhNYXRjaGVzKS5mb3JFYWNoKGZpbGVOYW1lID0+IHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKGNzc0luZGV4TWF0Y2hlc1tmaWxlTmFtZV0pO1xuICAgICAgfSkpLFxuICAgICAgLy8gQWxzbyB0ZXN0IHdpdGggZXh0cmFjdENzcyBmYWxzZS5cbiAgICAgIGNvbmNhdE1hcCgoKSA9PiBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLFxuICAgICAgICB7IGV4dHJhY3RDc3M6IGZhbHNlLCBzdHlsZXM6IGdldFN0eWxlc09wdGlvbigpIH0pKSxcbiAgICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgd2h5IGFkZGluZyB0aGlzIHRhcCBicmVha3MgdHlwaW5ncy5cbiAgICAgIC8vIFRoaXMgYWxzbyBoYXBwZW5zIGluIHRoZSBvdXRwdXQtaGFzaGluZyBzcGVjLlxuICAgICAgLy8gdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIC8vIENoZWNrIGpzIGZpbGVzIHdlcmUgY3JlYXRlZC5cbiAgICAgIHRhcCgoKSA9PiBPYmplY3Qua2V5cyhqc01hdGNoZXMpLmZvckVhY2goZmlsZU5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmaWxlTmFtZSkpKTtcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goanNNYXRjaGVzW2ZpbGVOYW1lXSk7XG4gICAgICB9KSksXG4gICAgICAvLyBDaGVjayBubyBjc3MgZmlsZXMgYXJlIGNyZWF0ZWQuXG4gICAgICB0YXAoKCkgPT4gT2JqZWN0LmtleXMoY3NzTWF0Y2hlcykuZm9yRWFjaChrZXkgPT5cbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhub3JtYWxpemUoa2V5KSkpLnRvQmUoZmFsc2UpLFxuICAgICAgKSksXG4gICAgICAvLyBDaGVjayBjaGVjayBpbmRleCBoYXMgc3R5bGVzIGluIHRoZSByaWdodCBvcmRlci5cbiAgICAgIHRhcCgoKSA9PiBPYmplY3Qua2V5cyhqc0luZGV4TWF0Y2hlcykuZm9yRWFjaChmaWxlTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaChqc0luZGV4TWF0Y2hlc1tmaWxlTmFtZV0pO1xuICAgICAgfSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgnc3VwcG9ydHMgZW1wdHkgc3R5bGVVcmxzIGluIGNvbXBvbmVudHMnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICcuL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyc6IGBcbiAgICAgICAgaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbiAgICAgICAgQENvbXBvbmVudCh7XG4gICAgICAgICAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gICAgICAgICAgc3R5bGVVcmxzOiBbXVxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICB9XG4gICAgICBgLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0geyBleHRyYWN0Q3NzOiB0cnVlIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBleHRlbnNpb25zV2l0aEltcG9ydFN1cHBvcnQuZm9yRWFjaChleHQgPT4ge1xuICAgIGl0KGBzdXBwb3J0cyBpbXBvcnRzIGluICR7ZXh0fSBmaWxlc2AsIChkb25lKSA9PiB7XG4gICAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAgIFtgc3JjL3N0eWxlcy4ke2V4dH1gXTogYFxuICAgICAgICAgIEBpbXBvcnQgJy4vaW1wb3J0ZWQtc3R5bGVzLiR7ZXh0fSc7XG4gICAgICAgICAgYm9keSB7IGJhY2tncm91bmQtY29sb3I6ICMwMGY7IH1cbiAgICAgICAgYCxcbiAgICAgICAgW2BzcmMvaW1wb3J0ZWQtc3R5bGVzLiR7ZXh0fWBdOiAncCB7IGJhY2tncm91bmQtY29sb3I6ICNmMDA7IH0nLFxuICAgICAgICBbYHNyYy9hcHAvYXBwLmNvbXBvbmVudC4ke2V4dH1gXTogYFxuICAgICAgICAgIEBpbXBvcnQgJy4vaW1wb3J0ZWQtY29tcG9uZW50LXN0eWxlcy4ke2V4dH0nO1xuICAgICAgICAgIC5vdXRlciB7XG4gICAgICAgICAgICAuaW5uZXIge1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgYCxcbiAgICAgICAgW2BzcmMvYXBwL2ltcG9ydGVkLWNvbXBvbmVudC1zdHlsZXMuJHtleHR9YF06ICdoMSB7IGJhY2tncm91bmQ6ICMwMDA7IH0nLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGNoZXM6IHsgW3BhdGg6IHN0cmluZ106IFJlZ0V4cCB9ID0ge1xuICAgICAgICAnZGlzdC9zdHlsZXMuY3NzJzogbmV3IFJlZ0V4cChcbiAgICAgICAgICAvLyBUaGUgZ2xvYmFsIHN0eWxlIHNob3VsZCBiZSB0aGVyZVxuICAgICAgICAgIC9wXFxzKntcXHMqYmFja2dyb3VuZC1jb2xvcjogI2YwMDtcXHMqfSgufFxcbnxcXHIpKi8uc291cmNlXG4gICAgICAgICAgLy8gVGhlIGdsb2JhbCBzdHlsZSB2aWEgaW1wb3J0IHNob3VsZCBiZSB0aGVyZVxuICAgICAgICAgICsgL2JvZHlcXHMqe1xccypiYWNrZ3JvdW5kLWNvbG9yOiAjMDBmO1xccyp9Ly5zb3VyY2UsXG4gICAgICAgICksXG4gICAgICAgICdkaXN0L3N0eWxlcy5jc3MubWFwJzogL1wibWFwcGluZ3NcIjpcIi4rXCIvLFxuICAgICAgICAnZGlzdC9tYWluLmpzJzogbmV3IFJlZ0V4cChcbiAgICAgICAgICAvLyBUaGUgY29tcG9uZW50IHN0eWxlIHNob3VsZCBiZSB0aGVyZVxuICAgICAgICAgIC9oMSgufFxcbnxcXHIpKmJhY2tncm91bmQ6XFxzKiMwMDAoLnxcXG58XFxyKSovLnNvdXJjZVxuICAgICAgICAgIC8vIFRoZSBjb21wb25lbnQgc3R5bGUgdmlhIGltcG9ydCBzaG91bGQgYmUgdGhlcmVcbiAgICAgICAgICArIC8ub3V0ZXIoLnxcXG58XFxyKSouaW5uZXIoLnxcXG58XFxyKSpiYWNrZ3JvdW5kOlxccyojW2ZGXSsvLnNvdXJjZSxcbiAgICAgICAgKSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgICAgZXh0cmFjdENzczogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICBzdHlsZXM6IFtgc3JjL3N0eWxlcy4ke2V4dH1gXSxcbiAgICAgIH07XG5cbiAgICAgIGhvc3QucmVwbGFjZUluRmlsZSgnc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJywgJy4vYXBwLmNvbXBvbmVudC5jc3MnLFxuICAgICAgICBgLi9hcHAuY29tcG9uZW50LiR7ZXh0fWApO1xuXG4gICAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICAgIHRhcCgoKSA9PiBPYmplY3Qua2V5cyhtYXRjaGVzKS5mb3JFYWNoKGZpbGVOYW1lID0+IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmaWxlTmFtZSkpKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaChtYXRjaGVzW2ZpbGVOYW1lXSk7XG4gICAgICAgIH0pKSxcbiAgICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICAgIH0pO1xuICB9KTtcblxuICBleHRlbnNpb25zV2l0aEltcG9ydFN1cHBvcnQuZm9yRWFjaChleHQgPT4ge1xuICAgIGl0KGBzdXBwb3J0cyBtYXRlcmlhbCBpbXBvcnRzIGluICR7ZXh0fSBmaWxlc2AsIChkb25lKSA9PiB7XG4gICAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAgIFtgc3JjL3N0eWxlcy4ke2V4dH1gXTogYFxuICAgICAgICAgIEBpbXBvcnQgXCJ+QGFuZ3VsYXIvbWF0ZXJpYWwvcHJlYnVpbHQtdGhlbWVzL2luZGlnby1waW5rLmNzc1wiO1xuICAgICAgICAgIEBpbXBvcnQgXCJAYW5ndWxhci9tYXRlcmlhbC9wcmVidWlsdC10aGVtZXMvaW5kaWdvLXBpbmsuY3NzXCI7XG4gICAgICAgIGAsXG4gICAgICAgIFtgc3JjL2FwcC9hcHAuY29tcG9uZW50LiR7ZXh0fWBdOiBgXG4gICAgICAgICAgQGltcG9ydCBcIn5AYW5ndWxhci9tYXRlcmlhbC9wcmVidWlsdC10aGVtZXMvaW5kaWdvLXBpbmsuY3NzXCI7XG4gICAgICAgICAgQGltcG9ydCBcIkBhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcy9pbmRpZ28tcGluay5jc3NcIjtcbiAgICAgICAgYCxcbiAgICAgIH0pO1xuICAgICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvYXBwL2FwcC5jb21wb25lbnQudHMnLCAnLi9hcHAuY29tcG9uZW50LmNzcycsXG4gICAgICAgIGAuL2FwcC5jb21wb25lbnQuJHtleHR9YCk7XG5cbiAgICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgICAgZXh0cmFjdENzczogdHJ1ZSxcbiAgICAgICAgc3R5bGVzOiBbeyBpbnB1dDogYHNyYy9zdHlsZXMuJHtleHR9YCB9XSxcbiAgICAgIH07XG5cbiAgICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdChgc3VwcG9ydHMgbWF0ZXJpYWwgaWNvbnNgLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgIGV4dHJhY3RDc3M6IHRydWUsXG4gICAgICBvcHRpbWl6YXRpb246IHRydWUsXG4gICAgICBzdHlsZXM6IFtcbiAgICAgICAgeyBpbnB1dDogJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9tYXRlcmlhbC1kZXNpZ24taWNvbnMvaWNvbmZvbnQvbWF0ZXJpYWwtaWNvbnMuY3NzJyB9LFxuICAgICAgXSxcbiAgICB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzLCBEZWZhdWx0VGltZW91dCAqIDIpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBleHRlbnNpb25zV2l0aFZhcmlhYmxlU3VwcG9ydC5mb3JFYWNoKGV4dCA9PiB7XG4gICAgaXQoYHN1cHBvcnRzICR7ZXh0fSBpbmNsdWRlUGF0aHNgLCAoZG9uZSkgPT4ge1xuXG4gICAgICBsZXQgdmFyaWFibGVBc3NpZ25tZW50ID0gJyc7XG4gICAgICBsZXQgdmFyaWFibGVyZWZlcmVuY2UgPSAnJztcbiAgICAgIGlmIChleHQgPT09ICdzY3NzJykge1xuICAgICAgICB2YXJpYWJsZUFzc2lnbm1lbnQgPSAnJHByaW1hcnktY29sb3I6JztcbiAgICAgICAgdmFyaWFibGVyZWZlcmVuY2UgPSAnJHByaW1hcnktY29sb3InO1xuICAgICAgfSBlbHNlIGlmIChleHQgPT09ICdzdHlsJykge1xuICAgICAgICB2YXJpYWJsZUFzc2lnbm1lbnQgPSAnJHByaW1hcnktY29sb3IgPSc7XG4gICAgICAgIHZhcmlhYmxlcmVmZXJlbmNlID0gJyRwcmltYXJ5LWNvbG9yJztcbiAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnbGVzcycpIHtcbiAgICAgICAgdmFyaWFibGVBc3NpZ25tZW50ID0gJ0BwcmltYXJ5LWNvbG9yOic7XG4gICAgICAgIHZhcmlhYmxlcmVmZXJlbmNlID0gJ0BwcmltYXJ5LWNvbG9yJztcbiAgICAgIH1cblxuICAgICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgICBbYHNyYy9zdHlsZS1wYXRocy92YXJpYWJsZXMuJHtleHR9YF06IGAke3ZhcmlhYmxlQXNzaWdubWVudH0gI2YwMDtgLFxuICAgICAgICBbYHNyYy9zdHlsZXMuJHtleHR9YF06IGBcbiAgICAgICAgICBAaW1wb3J0ICd2YXJpYWJsZXMnO1xuICAgICAgICAgIGgxIHsgY29sb3I6ICR7dmFyaWFibGVyZWZlcmVuY2V9OyB9XG4gICAgICAgIGAsXG4gICAgICAgIFtgc3JjL2FwcC9hcHAuY29tcG9uZW50LiR7ZXh0fWBdOiBgXG4gICAgICAgICAgQGltcG9ydCAndmFyaWFibGVzJztcbiAgICAgICAgICBoMiB7IGNvbG9yOiAke3ZhcmlhYmxlcmVmZXJlbmNlfTsgfVxuICAgICAgICBgLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGNoZXM6IHsgW3BhdGg6IHN0cmluZ106IFJlZ0V4cCB9ID0ge1xuICAgICAgICAnZGlzdC9zdHlsZXMuY3NzJzogL2gxXFxzKntcXHMqY29sb3I6ICNmMDA7XFxzKn0vLFxuICAgICAgICAnZGlzdC9tYWluLmpzJzogL2gyLip7Lipjb2xvcjogI2YwMDsuKn0vLFxuICAgICAgfTtcblxuICAgICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvYXBwL2FwcC5jb21wb25lbnQudHMnLCAnLi9hcHAuY29tcG9uZW50LmNzcycsXG4gICAgICAgIGAuL2FwcC5jb21wb25lbnQuJHtleHR9YCk7XG5cbiAgICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgICAgZXh0cmFjdENzczogdHJ1ZSxcbiAgICAgICAgc3R5bGVzOiBbYHNyYy9zdHlsZXMuJHtleHR9YF0sXG4gICAgICAgIHN0eWxlUHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICAgIGluY2x1ZGVQYXRoczogWydzcmMvc3R5bGUtcGF0aHMnXSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgICAgdGFwKCgpID0+IE9iamVjdC5rZXlzKG1hdGNoZXMpLmZvckVhY2goZmlsZU5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKG1hdGNoZXNbZmlsZU5hbWVdKTtcbiAgICAgICAgfSkpLFxuICAgICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdpbmxpbmVzIHJlc291cmNlcycsIChkb25lKSA9PiB7XG4gICAgaG9zdC5jb3B5RmlsZSgnc3JjL3NwZWN0cnVtLnBuZycsICdzcmMvbGFyZ2UucG5nJyk7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9zdHlsZXMuc2Nzcyc6IGBcbiAgICAgICAgaDEgeyBiYWNrZ3JvdW5kOiB1cmwoJy4vbGFyZ2UucG5nJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgIzBlNDBmYSAyNSUsICMwNjU0ZjQgNzUlKTsgfVxuICAgICAgICBoMiB7IGJhY2tncm91bmQ6IHVybCgnLi9zbWFsbC5zdmcnKTsgfVxuICAgICAgICBwICB7IGJhY2tncm91bmQ6IHVybCguL3NtYWxsLWlkLnN2ZyN0ZXN0SUQpOyB9XG4gICAgICBgLFxuICAgICAgJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MnOiBgXG4gICAgICAgIGgzIHsgYmFja2dyb3VuZDogdXJsKCcuLi9zbWFsbC5zdmcnKTsgfVxuICAgICAgICBoNCB7IGJhY2tncm91bmQ6IHVybChcIi4uL2xhcmdlLnBuZ1wiKTsgfVxuICAgICAgYCxcbiAgICAgICdzcmMvc21hbGwuc3ZnJzogaW1nU3ZnLFxuICAgICAgJ3NyYy9zbWFsbC1pZC5zdmcnOiBpbWdTdmcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7XG4gICAgICBhb3Q6IHRydWUsXG4gICAgICBleHRyYWN0Q3NzOiB0cnVlLFxuICAgICAgc3R5bGVzOiBbYHNyYy9zdHlsZXMuc2Nzc2BdLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnZGlzdC9zdHlsZXMuY3NzJztcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIC8vIExhcmdlIGltYWdlIHNob3VsZCBub3QgYmUgaW5saW5lZCwgYW5kIGdyYWRpZW50IHNob3VsZCBiZSB0aGVyZS5cbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goXG4gICAgICAgICAgL3VybFxcKFsnXCJdP2xhcmdlXFwucG5nWydcIl0/XFwpLFxccytsaW5lYXItZ3JhZGllbnRcXCh0byBib3R0b20sICMwZTQwZmEgMjUlLCAjMDY1NGY0IDc1JVxcKTsvKTtcbiAgICAgICAgLy8gU21hbGwgaW1hZ2Ugc2hvdWxkIGJlIGlubGluZWQuXG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC91cmxcXChcXFxcP1snXCJdZGF0YTppbWFnZVxcL3N2Z1xcK3htbC8pO1xuICAgICAgICAvLyBTbWFsbCBpbWFnZSB3aXRoIHBhcmFtIHNob3VsZCBub3QgYmUgaW5saW5lZC5cbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL3VybFxcKFsnXCJdP3NtYWxsLWlkXFwuc3ZnI3Rlc3RJRFsnXCJdP1xcKS8pO1xuICAgICAgfSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9ICdkaXN0L21haW4uanMnO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmaWxlTmFtZSkpKTtcbiAgICAgICAgLy8gTGFyZ2UgaW1hZ2Ugc2hvdWxkIG5vdCBiZSBpbmxpbmVkLlxuICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvdXJsXFwoKD86WydcIl18XFxcXCcpP2xhcmdlXFwucG5nKD86WydcIl18XFxcXCcpP1xcKS8pO1xuICAgICAgICAvLyBTbWFsbCBpbWFnZSBzaG91bGQgYmUgaW5saW5lZC5cbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL3VybFxcKFxcXFw/WydcIl1kYXRhOmltYWdlXFwvc3ZnXFwreG1sLyk7XG4gICAgICB9KSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKCdkaXN0L3NtYWxsLnN2ZycpKSkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKCdkaXN0L2xhcmdlLnBuZycpKSkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhub3JtYWxpemUoJ2Rpc3Qvc21hbGwtaWQuc3ZnJykpKS50b0JlKHRydWUpO1xuICAgICAgfSksXG4gICAgICAvLyBUT0RPOiBmaW5kIGEgd2F5IHRvIGNoZWNrIGxvZ2dlci9vdXRwdXQgZm9yIHdhcm5pbmdzLlxuICAgICAgLy8gaWYgKHN0ZG91dC5tYXRjaCgvcG9zdGNzcy11cmw6IFxcLis6IENhbid0IHJlYWQgZmlsZSAnXFwuKycsIGlnbm9yaW5nLykpIHtcbiAgICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBubyBwb3N0Y3NzLXVybCBmaWxlIHJlYWQgd2FybmluZ3MuJyk7XG4gICAgICAvLyB9XG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBzdXBwb3J0cyBmb250LWF3ZXNvbWUgaW1wb3J0c2AsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9zdHlsZXMuc2Nzcyc6IGBcbiAgICAgICAgJGZhLWZvbnQtcGF0aDogXCJ+Zm9udC1hd2Vzb21lL2ZvbnRzXCI7XG4gICAgICAgIEBpbXBvcnQgXCJ+Zm9udC1hd2Vzb21lL3Njc3MvZm9udC1hd2Vzb21lXCI7XG4gICAgICBgLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0geyBleHRyYWN0Q3NzOiB0cnVlLCBzdHlsZXM6IFtgc3JjL3N0eWxlcy5zY3NzYF0gfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDMwMDAwKTtcblxuICBpdChgdXNlcyBhdXRvcHJlZml4ZXJgLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvc3R5bGVzLmNzcyc6IHRhZ3Muc3RyaXBJbmRlbnRzYFxuICAgICAgICAvKiBub3JtYWwtY29tbWVudCAqL1xuICAgICAgICAvKiEgaW1wb3J0YW50LWNvbW1lbnQgKi9cbiAgICAgICAgZGl2IHsgZmxleDogMSB9YCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgZXh0cmFjdENzczogdHJ1ZSwgb3B0aW1pemF0aW9uOiBmYWxzZSB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gJ2Rpc3Qvc3R5bGVzLmNzcyc7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9Db250YWluKHRhZ3Muc3RyaXBJbmRlbnRzYFxuICAgICAgICAgIC8qIG5vcm1hbC1jb21tZW50ICovXG4gICAgICAgICAgLyohIGltcG9ydGFudC1jb21tZW50ICovXG4gICAgICAgICAgZGl2IHsgLW1zLWZsZXg6IDE7IGZsZXg6IDEgfWApO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KGBtaW5pbWl6ZXMgY3NzYCwgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL3N0eWxlcy5jc3MnOiB0YWdzLnN0cmlwSW5kZW50c2BcbiAgICAgICAgLyogbm9ybWFsLWNvbW1lbnQgKi9cbiAgICAgICAgLyohIGltcG9ydGFudC1jb21tZW50ICovXG4gICAgICAgIGRpdiB7IGZsZXg6IDEgfWAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IGV4dHJhY3RDc3M6IHRydWUsIG9wdGltaXphdGlvbjogdHJ1ZSB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzLCBEZWZhdWx0VGltZW91dCAqIDIpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnZGlzdC9zdHlsZXMuY3NzJztcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b0NvbnRhaW4oXG4gICAgICAgICAgJy8qISBpbXBvcnRhbnQtY29tbWVudCAqL2RpdnstbXMtZmxleDoxO2ZsZXg6MX0nKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICAvLyBUT0RPOiBjb25zaWRlciBtYWtpbmcgdGhpcyBhIHVuaXQgdGVzdCBpbiB0aGUgdXJsIHByb2Nlc3NpbmcgcGx1Z2lucy5cbiAgaXQoYHN1cHBvcnRzIGJhc2VIcmVmIGFuZCBkZXBsb3lVcmwgaW4gcmVzb3VyY2UgdXJsc2AsIChkb25lKSA9PiB7XG4gICAgLy8gVXNlIGEgbGFyZ2UgaW1hZ2UgZm9yIHRoZSByZWxhdGl2ZSByZWYgc28gaXQgY2Fubm90IGJlIGlubGluZWQuXG4gICAgaG9zdC5jb3B5RmlsZSgnc3JjL3NwZWN0cnVtLnBuZycsICcuL3NyYy9hc3NldHMvZ2xvYmFsLWltZy1yZWxhdGl2ZS5wbmcnKTtcbiAgICBob3N0LmNvcHlGaWxlKCdzcmMvc3BlY3RydW0ucG5nJywgJy4vc3JjL2Fzc2V0cy9jb21wb25lbnQtaW1nLXJlbGF0aXZlLnBuZycpO1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvc3R5bGVzLmNzcyc6IGBcbiAgICAgICAgaDEgeyBiYWNrZ3JvdW5kOiB1cmwoJy9hc3NldHMvZ2xvYmFsLWltZy1hYnNvbHV0ZS5zdmcnKTsgfVxuICAgICAgICBoMiB7IGJhY2tncm91bmQ6IHVybCgnLi9hc3NldHMvZ2xvYmFsLWltZy1yZWxhdGl2ZS5wbmcnKTsgfVxuICAgICAgYCxcbiAgICAgICdzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzJzogYFxuICAgICAgICBoMyB7IGJhY2tncm91bmQ6IHVybCgnL2Fzc2V0cy9jb21wb25lbnQtaW1nLWFic29sdXRlLnN2ZycpOyB9XG4gICAgICAgIGg0IHsgYmFja2dyb3VuZDogdXJsKCcuLi9hc3NldHMvY29tcG9uZW50LWltZy1yZWxhdGl2ZS5wbmcnKTsgfVxuICAgICAgYCxcbiAgICAgIC8vIFVzZSBhIHNtYWxsIFNWRyBmb3IgdGhlIGFic29sdXRlIGltYWdlIHRvIGhlbHAgdmFsaWRhdGUgdGhhdCBpdCBpcyBiZWluZyByZWZlcmVuY2VkLFxuICAgICAgLy8gYmVjYXVzZSBpdCBpcyBzbyBzbWFsbCBpdCB3b3VsZCBiZSBpbmxpbmVkIHVzdWFsbHkuXG4gICAgICAnc3JjL2Fzc2V0cy9nbG9iYWwtaW1nLWFic29sdXRlLnN2Zyc6IGltZ1N2ZyxcbiAgICAgICdzcmMvYXNzZXRzL2NvbXBvbmVudC1pbWctYWJzb2x1dGUuc3ZnJzogaW1nU3ZnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3R5bGVzQnVuZGxlID0gJ2Rpc3Qvc3R5bGVzLmNzcyc7XG4gICAgY29uc3QgbWFpbkJ1bmRsZSA9ICdkaXN0L21haW4uanMnO1xuXG4gICAgLy8gQ2hlY2sgYmFzZSBwYXRocyBhcmUgY29ycmVjdGx5IGdlbmVyYXRlZC5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCB7IGFvdDogdHJ1ZSwgZXh0cmFjdENzczogdHJ1ZSB9KS5waXBlKFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShzdHlsZXNCdW5kbGUpKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWFpbiA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUobWFpbkJ1bmRsZSkpKTtcbiAgICAgICAgZXhwZWN0KHN0eWxlcykudG9Db250YWluKGB1cmwoJy9hc3NldHMvZ2xvYmFsLWltZy1hYnNvbHV0ZS5zdmcnKWApO1xuICAgICAgICBleHBlY3Qoc3R5bGVzKS50b0NvbnRhaW4oYHVybCgnZ2xvYmFsLWltZy1yZWxhdGl2ZS5wbmcnKWApO1xuICAgICAgICBleHBlY3QobWFpbikudG9Db250YWluKGB1cmwoJy9hc3NldHMvY29tcG9uZW50LWltZy1hYnNvbHV0ZS5zdmcnKWApO1xuICAgICAgICBleHBlY3QobWFpbikudG9Db250YWluKGB1cmwoJ2NvbXBvbmVudC1pbWctcmVsYXRpdmUucG5nJylgKTtcbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhub3JtYWxpemUoJ2Rpc3QvZ2xvYmFsLWltZy1hYnNvbHV0ZS5zdmcnKSkpXG4gICAgICAgICAgLnRvQmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKG5vcm1hbGl6ZSgnZGlzdC9nbG9iYWwtaW1nLXJlbGF0aXZlLnBuZycpKSlcbiAgICAgICAgICAudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhvc3Quc2NvcGVkU3luYygpLmV4aXN0cyhub3JtYWxpemUoJ2Rpc3QvY29tcG9uZW50LWltZy1hYnNvbHV0ZS5zdmcnKSkpXG4gICAgICAgICAgLnRvQmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKG5vcm1hbGl6ZSgnZGlzdC9jb21wb25lbnQtaW1nLXJlbGF0aXZlLnBuZycpKSlcbiAgICAgICAgICAudG9CZSh0cnVlKTtcbiAgICAgIH0pLFxuICAgICAgLy8gQ2hlY2sgdXJscyB3aXRoIGRlcGxveS11cmwgc2NoZW1lIGFyZSB1c2VkIGFzIGlzLlxuICAgICAgY29uY2F0TWFwKCgpID0+IHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsXG4gICAgICAgIHsgZXh0cmFjdENzczogdHJ1ZSwgYmFzZUhyZWY6ICcvYmFzZS8nLCBkZXBsb3lVcmw6ICdodHRwOi8vZGVwbG95LnVybC8nIH0sXG4gICAgICApKSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoXG4gICAgICAgICAgaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoc3R5bGVzQnVuZGxlKSksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG1haW4gPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKG1haW5CdW5kbGUpKSk7XG4gICAgICAgIGV4cGVjdChzdHlsZXMpXG4gICAgICAgICAgLnRvQ29udGFpbihgdXJsKCdodHRwOi8vZGVwbG95LnVybC9hc3NldHMvZ2xvYmFsLWltZy1hYnNvbHV0ZS5zdmcnKWApO1xuICAgICAgICBleHBlY3QobWFpbilcbiAgICAgICAgICAudG9Db250YWluKGB1cmwoJ2h0dHA6Ly9kZXBsb3kudXJsL2Fzc2V0cy9jb21wb25lbnQtaW1nLWFic29sdXRlLnN2ZycpYCk7XG4gICAgICB9KSxcbiAgICAgIC8vIENoZWNrIHVybHMgd2l0aCBiYXNlLWhyZWYgc2NoZW1lIGFyZSB1c2VkIGFzIGlzICh3aXRoIGRlcGxveS11cmwpLlxuICAgICAgY29uY2F0TWFwKCgpID0+IHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsXG4gICAgICAgIHsgZXh0cmFjdENzczogdHJ1ZSwgYmFzZUhyZWY6ICdodHRwOi8vYmFzZS51cmwvJywgZGVwbG95VXJsOiAnZGVwbG95LycgfSxcbiAgICAgICkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShzdHlsZXNCdW5kbGUpKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWFpbiA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUobWFpbkJ1bmRsZSkpKTtcbiAgICAgICAgZXhwZWN0KHN0eWxlcylcbiAgICAgICAgICAudG9Db250YWluKGB1cmwoJ2h0dHA6Ly9iYXNlLnVybC9kZXBsb3kvYXNzZXRzL2dsb2JhbC1pbWctYWJzb2x1dGUuc3ZnJylgKTtcbiAgICAgICAgZXhwZWN0KG1haW4pXG4gICAgICAgICAgLnRvQ29udGFpbihgdXJsKCdodHRwOi8vYmFzZS51cmwvZGVwbG95L2Fzc2V0cy9jb21wb25lbnQtaW1nLWFic29sdXRlLnN2ZycpYCk7XG4gICAgICB9KSxcbiAgICAgIC8vIENoZWNrIHVybHMgd2l0aCBkZXBsb3ktdXJsIGFuZCBiYXNlLWhyZWYgc2NoZW1lIG9ubHkgdXNlIGRlcGxveS11cmwuXG4gICAgICBjb25jYXRNYXAoKCkgPT4gcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywge1xuICAgICAgICBleHRyYWN0Q3NzOiB0cnVlLFxuICAgICAgICBiYXNlSHJlZjogJ2h0dHA6Ly9iYXNlLnVybC8nLFxuICAgICAgICBkZXBsb3lVcmw6ICdodHRwOi8vZGVwbG95LnVybC8nLFxuICAgICAgfSxcbiAgICAgICkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShzdHlsZXNCdW5kbGUpKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWFpbiA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUobWFpbkJ1bmRsZSkpKTtcbiAgICAgICAgZXhwZWN0KHN0eWxlcykudG9Db250YWluKGB1cmwoJ2h0dHA6Ly9kZXBsb3kudXJsL2Fzc2V0cy9nbG9iYWwtaW1nLWFic29sdXRlLnN2ZycpYCk7XG4gICAgICAgIGV4cGVjdChtYWluKS50b0NvbnRhaW4oYHVybCgnaHR0cDovL2RlcGxveS51cmwvYXNzZXRzL2NvbXBvbmVudC1pbWctYWJzb2x1dGUuc3ZnJylgKTtcbiAgICAgIH0pLFxuICAgICAgLy8gQ2hlY2sgd2l0aCBzY2hlbWVsZXNzIGJhc2UtaHJlZiBhbmQgZGVwbG95LXVybCBmbGFncy5cbiAgICAgIGNvbmNhdE1hcCgoKSA9PiBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLFxuICAgICAgICB7IGV4dHJhY3RDc3M6IHRydWUsIGJhc2VIcmVmOiAnL2Jhc2UvJywgZGVwbG95VXJsOiAnZGVwbG95LycgfSxcbiAgICAgICkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShzdHlsZXNCdW5kbGUpKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWFpbiA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUobWFpbkJ1bmRsZSkpKTtcbiAgICAgICAgZXhwZWN0KHN0eWxlcykudG9Db250YWluKGB1cmwoJy9iYXNlL2RlcGxveS9hc3NldHMvZ2xvYmFsLWltZy1hYnNvbHV0ZS5zdmcnKWApO1xuICAgICAgICBleHBlY3QobWFpbikudG9Db250YWluKGB1cmwoJy9iYXNlL2RlcGxveS9hc3NldHMvY29tcG9uZW50LWltZy1hYnNvbHV0ZS5zdmcnKWApO1xuICAgICAgfSksXG4gICAgICAvLyBDaGVjayB3aXRoIGlkZW50aWNhbCBiYXNlLWhyZWYgYW5kIGRlcGxveS11cmwgZmxhZ3MuXG4gICAgICBjb25jYXRNYXAoKCkgPT4gcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYyxcbiAgICAgICAgeyBleHRyYWN0Q3NzOiB0cnVlLCBiYXNlSHJlZjogJy9iYXNlLycsIGRlcGxveVVybDogJy9iYXNlLycgfSxcbiAgICAgICkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShzdHlsZXNCdW5kbGUpKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWFpbiA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUobWFpbkJ1bmRsZSkpKTtcbiAgICAgICAgZXhwZWN0KHN0eWxlcykudG9Db250YWluKGB1cmwoJy9iYXNlL2Fzc2V0cy9nbG9iYWwtaW1nLWFic29sdXRlLnN2ZycpYCk7XG4gICAgICAgIGV4cGVjdChtYWluKS50b0NvbnRhaW4oYHVybCgnL2Jhc2UvYXNzZXRzL2NvbXBvbmVudC1pbWctYWJzb2x1dGUuc3ZnJylgKTtcbiAgICAgIH0pLFxuICAgICAgLy8gQ2hlY2sgd2l0aCBvbmx5IGJhc2UtaHJlZiBmbGFnLlxuICAgICAgY29uY2F0TWFwKCgpID0+IHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsXG4gICAgICAgIHsgZXh0cmFjdENzczogdHJ1ZSwgYmFzZUhyZWY6ICcvYmFzZS8nIH0sXG4gICAgICApKSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoXG4gICAgICAgICAgaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoc3R5bGVzQnVuZGxlKSksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG1haW4gPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKG1haW5CdW5kbGUpKSk7XG4gICAgICAgIGV4cGVjdChzdHlsZXMpLnRvQ29udGFpbihgdXJsKCcvYmFzZS9hc3NldHMvZ2xvYmFsLWltZy1hYnNvbHV0ZS5zdmcnKWApO1xuICAgICAgICBleHBlY3QobWFpbikudG9Db250YWluKGB1cmwoJy9iYXNlL2Fzc2V0cy9jb21wb25lbnQtaW1nLWFic29sdXRlLnN2ZycpYCk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSwgOTAwMDApO1xuXG4gIGl0KGBzdXBwb3J0cyBib290c3RyYXBANGAsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0ge1xuICAgICAgZXh0cmFjdENzczogdHJ1ZSxcbiAgICAgIHN0eWxlczogWycuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5jc3MnXSxcbiAgICAgIHNjcmlwdHM6IFsnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9kaXN0L2pzL2Jvb3RzdHJhcC5qcyddLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19