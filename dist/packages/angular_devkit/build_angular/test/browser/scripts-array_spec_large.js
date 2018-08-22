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
describe('Browser Builder scripts array', () => {
    const outputPath = core_1.normalize('dist');
    const scripts = {
        'src/input-script.js': 'console.log(\'input-script\'); var number = 1+1;',
        'src/zinput-script.js': 'console.log(\'zinput-script\');',
        'src/finput-script.js': 'console.log(\'finput-script\');',
        'src/uinput-script.js': 'console.log(\'uinput-script\');',
        'src/binput-script.js': 'console.log(\'binput-script\');',
        'src/ainput-script.js': 'console.log(\'ainput-script\');',
        'src/cinput-script.js': 'console.log(\'cinput-script\');',
        'src/lazy-script.js': 'console.log(\'lazy-script\');',
        'src/pre-rename-script.js': 'console.log(\'pre-rename-script\');',
        'src/pre-rename-lazy-script.js': 'console.log(\'pre-rename-lazy-script\');',
    };
    const getScriptsOption = () => [
        'src/input-script.js',
        'src/zinput-script.js',
        'src/finput-script.js',
        'src/uinput-script.js',
        'src/binput-script.js',
        'src/ainput-script.js',
        'src/cinput-script.js',
        { input: 'src/lazy-script.js', bundleName: 'lazy-script', lazy: true },
        { input: 'src/pre-rename-script.js', bundleName: 'renamed-script' },
        { input: 'src/pre-rename-lazy-script.js', bundleName: 'renamed-lazy-script', lazy: true },
    ];
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        const matches = {
            './dist/scripts.js': 'input-script',
            './dist/lazy-script.js': 'lazy-script',
            './dist/renamed-script.js': 'pre-rename-script',
            './dist/renamed-lazy-script.js': 'pre-rename-lazy-script',
            './dist/main.js': 'input-script',
            './dist/index.html': '<script type="text/javascript" src="runtime.js"></script>'
                + '<script type="text/javascript" src="polyfills.js"></script>'
                + '<script type="text/javascript" src="scripts.js"></script>'
                + '<script type="text/javascript" src="renamed-script.js"></script>'
                + '<script type="text/javascript" src="vendor.js"></script>'
                + '<script type="text/javascript" src="main.js"></script>',
        };
        utils_1.host.writeMultipleFiles(scripts);
        utils_1.host.appendToFile('src/main.ts', '\nimport \'./input-script.js\';');
        // Remove styles so we don't have to account for them in the index.html order check.
        const overrides = {
            styles: [],
            scripts: getScriptsOption(),
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => Object.keys(matches).forEach(fileName => {
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(matches[fileName]);
        }))).toPromise().then(done, done.fail);
    });
    it('uglifies, uses sourcemaps, and adds hashes', (done) => {
        utils_1.host.writeMultipleFiles(scripts);
        const overrides = {
            optimization: true,
            sourceMap: true,
            outputHashing: 'all',
            scripts: getScriptsOption(),
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides, testing_1.DefaultTimeout * 2).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const scriptsBundle = utils_1.host.fileMatchExists(outputPath, /scripts\.[0-9a-f]{20}\.js/);
            expect(scriptsBundle).toBeTruthy();
            const fileName = core_1.join(outputPath, scriptsBundle);
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch('var number=2;');
            expect(utils_1.host.fileMatchExists(outputPath, /scripts\.[0-9a-f]{20}\.js\.map/))
                .toBeTruthy();
            expect(utils_1.host.fileMatchExists(outputPath, /renamed-script\.[0-9a-f]{20}\.js/))
                .toBeTruthy();
            expect(utils_1.host.fileMatchExists(outputPath, /renamed-script\.[0-9a-f]{20}\.js\.map/))
                .toBeTruthy();
            expect(utils_1.host.fileMatchExists(outputPath, /scripts\.[0-9a-f]{20}\.js/)).toBeTruthy();
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/lazy-script.js'))).toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/lazy-script.js.map'))).toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/renamed-lazy-script.js'))).toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/renamed-lazy-script.js.map')))
                .toBe(true);
        })).toPromise().then(done, done.fail);
    });
    it('preserves script order', (done) => {
        utils_1.host.writeMultipleFiles(scripts);
        const overrides = { scripts: getScriptsOption() };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const re = new RegExp(/.*['"]input-script['"](.|\n|\r)*/.source
                + /['"]zinput-script['"](.|\n|\r)*/.source
                + /['"]finput-script['"](.|\n|\r)*/.source
                + /['"]uinput-script['"](.|\n|\r)*/.source
                + /['"]binput-script['"](.|\n|\r)*/.source
                + /['"]ainput-script['"](.|\n|\r)*/.source
                + /['"]cinput-script['"]/.source);
            const fileName = './dist/scripts.js';
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(re);
        })).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0cy1hcnJheV9zcGVjX2xhcmdlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9hbmd1bGFyL3Rlc3QvYnJvd3Nlci9zY3JpcHRzLWFycmF5X3NwZWNfbGFyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrREFBa0Y7QUFDbEYsK0NBQWdGO0FBQ2hGLDhDQUFxQztBQUNyQyxvQ0FBbUQ7QUFHbkQsUUFBUSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUU3QyxNQUFNLFVBQVUsR0FBRyxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sT0FBTyxHQUErQjtRQUMxQyxxQkFBcUIsRUFBRSxrREFBa0Q7UUFDekUsc0JBQXNCLEVBQUUsaUNBQWlDO1FBQ3pELHNCQUFzQixFQUFFLGlDQUFpQztRQUN6RCxzQkFBc0IsRUFBRSxpQ0FBaUM7UUFDekQsc0JBQXNCLEVBQUUsaUNBQWlDO1FBQ3pELHNCQUFzQixFQUFFLGlDQUFpQztRQUN6RCxzQkFBc0IsRUFBRSxpQ0FBaUM7UUFDekQsb0JBQW9CLEVBQUUsK0JBQStCO1FBQ3JELDBCQUEwQixFQUFFLHFDQUFxQztRQUNqRSwrQkFBK0IsRUFBRSwwQ0FBMEM7S0FDNUUsQ0FBQztJQUNGLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDN0IscUJBQXFCO1FBQ3JCLHNCQUFzQjtRQUN0QixzQkFBc0I7UUFDdEIsc0JBQXNCO1FBQ3RCLHNCQUFzQjtRQUN0QixzQkFBc0I7UUFDdEIsc0JBQXNCO1FBQ3RCLEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUN0RSxFQUFFLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxVQUFVLEVBQUUsZ0JB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QkFBbUIsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxnQkFBUyxDQUFDLGtCQUFrQixDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FDSCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IERlZmF1bHRUaW1lb3V0LCBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IFBhdGhGcmFnbWVudCwgam9pbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBicm93c2VyVGFyZ2V0U3BlYywgaG9zdCB9IGZyb20gJy4uL3V0aWxzJztcblxuXG5kZXNjcmliZSgnQnJvd3NlciBCdWlsZGVyIHNjcmlwdHMgYXJyYXknLCAoKSA9PiB7XG5cbiAgY29uc3Qgb3V0cHV0UGF0aCA9IG5vcm1hbGl6ZSgnZGlzdCcpO1xuICBjb25zdCBzY3JpcHRzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAnc3JjL2lucHV0LXNjcmlwdC5qcyc6ICdjb25zb2xlLmxvZyhcXCdpbnB1dC1zY3JpcHRcXCcpOyB2YXIgbnVtYmVyID0gMSsxOycsXG4gICAgJ3NyYy96aW5wdXQtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ3ppbnB1dC1zY3JpcHRcXCcpOycsXG4gICAgJ3NyYy9maW5wdXQtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ2ZpbnB1dC1zY3JpcHRcXCcpOycsXG4gICAgJ3NyYy91aW5wdXQtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ3VpbnB1dC1zY3JpcHRcXCcpOycsXG4gICAgJ3NyYy9iaW5wdXQtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ2JpbnB1dC1zY3JpcHRcXCcpOycsXG4gICAgJ3NyYy9haW5wdXQtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ2FpbnB1dC1zY3JpcHRcXCcpOycsXG4gICAgJ3NyYy9jaW5wdXQtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ2NpbnB1dC1zY3JpcHRcXCcpOycsXG4gICAgJ3NyYy9sYXp5LXNjcmlwdC5qcyc6ICdjb25zb2xlLmxvZyhcXCdsYXp5LXNjcmlwdFxcJyk7JyxcbiAgICAnc3JjL3ByZS1yZW5hbWUtc2NyaXB0LmpzJzogJ2NvbnNvbGUubG9nKFxcJ3ByZS1yZW5hbWUtc2NyaXB0XFwnKTsnLFxuICAgICdzcmMvcHJlLXJlbmFtZS1sYXp5LXNjcmlwdC5qcyc6ICdjb25zb2xlLmxvZyhcXCdwcmUtcmVuYW1lLWxhenktc2NyaXB0XFwnKTsnLFxuICB9O1xuICBjb25zdCBnZXRTY3JpcHRzT3B0aW9uID0gKCkgPT4gW1xuICAgICdzcmMvaW5wdXQtc2NyaXB0LmpzJyxcbiAgICAnc3JjL3ppbnB1dC1zY3JpcHQuanMnLFxuICAgICdzcmMvZmlucHV0LXNjcmlwdC5qcycsXG4gICAgJ3NyYy91aW5wdXQtc2NyaXB0LmpzJyxcbiAgICAnc3JjL2JpbnB1dC1zY3JpcHQuanMnLFxuICAgICdzcmMvYWlucHV0LXNjcmlwdC5qcycsXG4gICAgJ3NyYy9jaW5wdXQtc2NyaXB0LmpzJyxcbiAgICB7IGlucHV0OiAnc3JjL2xhenktc2NyaXB0LmpzJywgYnVuZGxlTmFtZTogJ2xhenktc2NyaXB0JywgbGF6eTogdHJ1ZSB9LFxuICAgIHsgaW5wdXQ6ICdzcmMvcHJlLXJlbmFtZS1zY3JpcHQuanMnLCBidW5kbGVOYW1lOiAncmVuYW1lZC1zY3JpcHQnIH0sXG4gICAgeyBpbnB1dDogJ3NyYy9wcmUtcmVuYW1lLWxhenktc2NyaXB0LmpzJywgYnVuZGxlTmFtZTogJ3JlbmFtZWQtbGF6eS1zY3JpcHQnLCBsYXp5OiB0cnVlIH0sXG4gIF07XG5cbiAgYmVmb3JlRWFjaChkb25lID0+IGhvc3QuaW5pdGlhbGl6ZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG4gIGFmdGVyRWFjaChkb25lID0+IGhvc3QucmVzdG9yZSgpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cbiAgaXQoJ3dvcmtzJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBtYXRjaGVzOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICcuL2Rpc3Qvc2NyaXB0cy5qcyc6ICdpbnB1dC1zY3JpcHQnLFxuICAgICAgJy4vZGlzdC9sYXp5LXNjcmlwdC5qcyc6ICdsYXp5LXNjcmlwdCcsXG4gICAgICAnLi9kaXN0L3JlbmFtZWQtc2NyaXB0LmpzJzogJ3ByZS1yZW5hbWUtc2NyaXB0JyxcbiAgICAgICcuL2Rpc3QvcmVuYW1lZC1sYXp5LXNjcmlwdC5qcyc6ICdwcmUtcmVuYW1lLWxhenktc2NyaXB0JyxcbiAgICAgICcuL2Rpc3QvbWFpbi5qcyc6ICdpbnB1dC1zY3JpcHQnLFxuICAgICAgJy4vZGlzdC9pbmRleC5odG1sJzogJzxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cInJ1bnRpbWUuanNcIj48L3NjcmlwdD4nXG4gICAgICAgICsgJzxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cInBvbHlmaWxscy5qc1wiPjwvc2NyaXB0PidcbiAgICAgICAgKyAnPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwic2NyaXB0cy5qc1wiPjwvc2NyaXB0PidcbiAgICAgICAgKyAnPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwicmVuYW1lZC1zY3JpcHQuanNcIj48L3NjcmlwdD4nXG4gICAgICAgICsgJzxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cInZlbmRvci5qc1wiPjwvc2NyaXB0PidcbiAgICAgICAgKyAnPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwibWFpbi5qc1wiPjwvc2NyaXB0PicsXG4gICAgfTtcblxuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHNjcmlwdHMpO1xuICAgIGhvc3QuYXBwZW5kVG9GaWxlKCdzcmMvbWFpbi50cycsICdcXG5pbXBvcnQgXFwnLi9pbnB1dC1zY3JpcHQuanNcXCc7Jyk7XG5cbiAgICAvLyBSZW1vdmUgc3R5bGVzIHNvIHdlIGRvbid0IGhhdmUgdG8gYWNjb3VudCBmb3IgdGhlbSBpbiB0aGUgaW5kZXguaHRtbCBvcmRlciBjaGVjay5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7XG4gICAgICBzdHlsZXM6IFtdLFxuICAgICAgc2NyaXB0czogZ2V0U2NyaXB0c09wdGlvbigpLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IE9iamVjdC5rZXlzKG1hdGNoZXMpLmZvckVhY2goZmlsZU5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmaWxlTmFtZSkpKTtcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2gobWF0Y2hlc1tmaWxlTmFtZV0pO1xuICAgICAgfSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgndWdsaWZpZXMsIHVzZXMgc291cmNlbWFwcywgYW5kIGFkZHMgaGFzaGVzJywgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhzY3JpcHRzKTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgIG9wdGltaXphdGlvbjogdHJ1ZSxcbiAgICAgIHNvdXJjZU1hcDogdHJ1ZSxcbiAgICAgIG91dHB1dEhhc2hpbmc6ICdhbGwnLFxuICAgICAgc2NyaXB0czogZ2V0U2NyaXB0c09wdGlvbigpLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMsIERlZmF1bHRUaW1lb3V0ICogMikucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBzY3JpcHRzQnVuZGxlID0gaG9zdC5maWxlTWF0Y2hFeGlzdHMob3V0cHV0UGF0aCwgL3NjcmlwdHNcXC5bMC05YS1mXXsyMH1cXC5qcy8pO1xuICAgICAgICBleHBlY3Qoc2NyaXB0c0J1bmRsZSkudG9CZVRydXRoeSgpO1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGpvaW4ob3V0cHV0UGF0aCwgc2NyaXB0c0J1bmRsZSBhcyBQYXRoRnJhZ21lbnQpO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmaWxlTmFtZSkpKTtcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goJ3ZhciBudW1iZXI9MjsnKTtcbiAgICAgICAgZXhwZWN0KGhvc3QuZmlsZU1hdGNoRXhpc3RzKG91dHB1dFBhdGgsIC9zY3JpcHRzXFwuWzAtOWEtZl17MjB9XFwuanNcXC5tYXAvKSlcbiAgICAgICAgICAudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3QoaG9zdC5maWxlTWF0Y2hFeGlzdHMob3V0cHV0UGF0aCwgL3JlbmFtZWQtc2NyaXB0XFwuWzAtOWEtZl17MjB9XFwuanMvKSlcbiAgICAgICAgICAudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3QoaG9zdC5maWxlTWF0Y2hFeGlzdHMob3V0cHV0UGF0aCwgL3JlbmFtZWQtc2NyaXB0XFwuWzAtOWEtZl17MjB9XFwuanNcXC5tYXAvKSlcbiAgICAgICAgICAudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3QoaG9zdC5maWxlTWF0Y2hFeGlzdHMob3V0cHV0UGF0aCwgL3NjcmlwdHNcXC5bMC05YS1mXXsyMH1cXC5qcy8pKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKCdkaXN0L2xhenktc2NyaXB0LmpzJykpKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKG5vcm1hbGl6ZSgnZGlzdC9sYXp5LXNjcmlwdC5qcy5tYXAnKSkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKCdkaXN0L3JlbmFtZWQtbGF6eS1zY3JpcHQuanMnKSkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMobm9ybWFsaXplKCdkaXN0L3JlbmFtZWQtbGF6eS1zY3JpcHQuanMubWFwJykpKVxuICAgICAgICAgIC50b0JlKHRydWUpO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdwcmVzZXJ2ZXMgc2NyaXB0IG9yZGVyJywgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhzY3JpcHRzKTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgc2NyaXB0czogZ2V0U2NyaXB0c09wdGlvbigpIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgIC8uKlsnXCJdaW5wdXQtc2NyaXB0WydcIl0oLnxcXG58XFxyKSovLnNvdXJjZVxuICAgICAgICAgICsgL1snXCJdemlucHV0LXNjcmlwdFsnXCJdKC58XFxufFxccikqLy5zb3VyY2VcbiAgICAgICAgICArIC9bJ1wiXWZpbnB1dC1zY3JpcHRbJ1wiXSgufFxcbnxcXHIpKi8uc291cmNlXG4gICAgICAgICAgKyAvWydcIl11aW5wdXQtc2NyaXB0WydcIl0oLnxcXG58XFxyKSovLnNvdXJjZVxuICAgICAgICAgICsgL1snXCJdYmlucHV0LXNjcmlwdFsnXCJdKC58XFxufFxccikqLy5zb3VyY2VcbiAgICAgICAgICArIC9bJ1wiXWFpbnB1dC1zY3JpcHRbJ1wiXSgufFxcbnxcXHIpKi8uc291cmNlXG4gICAgICAgICAgKyAvWydcIl1jaW5wdXQtc2NyaXB0WydcIl0vLnNvdXJjZSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnLi9kaXN0L3NjcmlwdHMuanMnO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZShmaWxlTmFtZSkpKTtcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2gocmUpO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xufSk7XG4iXX0=