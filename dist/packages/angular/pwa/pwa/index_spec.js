"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
// tslint:disable:max-line-length
describe('PWA Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@angular/pwa', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        project: 'bar',
        target: 'build',
        configuration: 'production',
        title: 'Fake Title',
    };
    let appTree;
    // tslint:disable-next-line:no-any
    const workspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    };
    // tslint:disable-next-line:no-any
    const appOptions = {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
    };
    beforeEach(() => {
        appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
        appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    });
    it('should run the service worker schematic', () => {
        const tree = schematicRunner.runSchematic('ng-add', defaultOptions, appTree);
        const configText = tree.readContent('/angular.json');
        const config = JSON.parse(configText);
        const swFlag = config.projects.bar.architect.build.configurations.production.serviceWorker;
        expect(swFlag).toEqual(true);
    });
    it('should create icon files', () => {
        const dimensions = [72, 96, 128, 144, 152, 192, 384, 512];
        const iconPath = '/projects/bar/src/assets/icons/icon-';
        const tree = schematicRunner.runSchematic('ng-add', defaultOptions, appTree);
        dimensions.forEach(d => {
            const path = `${iconPath}${d}x${d}.png`;
            expect(tree.exists(path)).toEqual(true);
        });
    });
    it('should create a manifest file', () => {
        const tree = schematicRunner.runSchematic('ng-add', defaultOptions, appTree);
        expect(tree.exists('/projects/bar/src/manifest.json')).toEqual(true);
    });
    it('should set the name & short_name in the manifest file', () => {
        const tree = schematicRunner.runSchematic('ng-add', defaultOptions, appTree);
        const manifestText = tree.readContent('/projects/bar/src/manifest.json');
        const manifest = JSON.parse(manifestText);
        expect(manifest.name).toEqual(defaultOptions.title);
        expect(manifest.short_name).toEqual(defaultOptions.title);
    });
    it('should set the name & short_name in the manifest file when no title provided', () => {
        const options = Object.assign({}, defaultOptions, { title: undefined });
        const tree = schematicRunner.runSchematic('ng-add', options, appTree);
        const manifestText = tree.readContent('/projects/bar/src/manifest.json');
        const manifest = JSON.parse(manifestText);
        expect(manifest.name).toEqual(defaultOptions.project);
        expect(manifest.short_name).toEqual(defaultOptions.project);
    });
    it('should update the index file', () => {
        const tree = schematicRunner.runSchematic('ng-add', defaultOptions, appTree);
        const content = tree.readContent('projects/bar/src/index.html');
        expect(content).toMatch(/<link rel="manifest" href="manifest.json">/);
        expect(content).toMatch(/<meta name="theme-color" content="#1976d2">/);
        expect(content)
            .toMatch(/<noscript>Please enable JavaScript to continue using this application.<\/noscript>/);
    });
    it('should update the build and test assets configuration', () => {
        const tree = schematicRunner.runSchematic('ng-add', defaultOptions, appTree);
        const configText = tree.readContent('/angular.json');
        const config = JSON.parse(configText);
        const architect = config.projects.bar.architect;
        ['build', 'test'].forEach((target) => {
            expect(architect[target].options.assets).toContain('projects/bar/src/manifest.json');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhci9wd2EvcHdhL2luZGV4X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxnRUFBdUY7QUFDdkYsNkJBQTZCO0FBSTdCLGlDQUFpQztBQUNqQyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixNQUFNLGVBQWUsR0FBRyxJQUFJLDZCQUFtQixDQUM3QyxjQUFjLEVBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FDM0MsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFlO1FBQ2pDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFLE9BQU87UUFDZixhQUFhLEVBQUUsWUFBWTtRQUMzQixLQUFLLEVBQUUsWUFBWTtLQUNwQixDQUFDO0lBRUYsSUFBSSxPQUFxQixDQUFDO0lBRTFCLGtDQUFrQztJQUNsQyxNQUFNLGdCQUFnQixHQUFRO1FBQzVCLElBQUksRUFBRSxXQUFXO1FBQ2pCLGNBQWMsRUFBRSxVQUFVO1FBQzFCLE9BQU8sRUFBRSxPQUFPO0tBQ2pCLENBQUM7SUFFRixrQ0FBa0M7SUFDbEMsTUFBTSxVQUFVLEdBQVE7UUFDdEIsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsS0FBSztRQUNsQixjQUFjLEVBQUUsS0FBSztRQUNyQixPQUFPLEVBQUUsS0FBSztRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQztJQUVGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxPQUFPLEdBQUcsZUFBZSxDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3JHLE9BQU8sR0FBRyxlQUFlLENBQUMsb0JBQW9C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RUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBTY2hlbWF0aWNUZXN0UnVubmVyLCBVbml0VGVzdFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgUHdhT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbmRlc2NyaWJlKCdQV0EgU2NoZW1hdGljJywgKCkgPT4ge1xuICBjb25zdCBzY2hlbWF0aWNSdW5uZXIgPSBuZXcgU2NoZW1hdGljVGVzdFJ1bm5lcihcbiAgICAnQGFuZ3VsYXIvcHdhJyxcbiAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vY29sbGVjdGlvbi5qc29uJyksXG4gICk7XG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBQd2FPcHRpb25zID0ge1xuICAgIHByb2plY3Q6ICdiYXInLFxuICAgIHRhcmdldDogJ2J1aWxkJyxcbiAgICBjb25maWd1cmF0aW9uOiAncHJvZHVjdGlvbicsXG4gICAgdGl0bGU6ICdGYWtlIFRpdGxlJyxcbiAgfTtcblxuICBsZXQgYXBwVHJlZTogVW5pdFRlc3RUcmVlO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgY29uc3Qgd29ya3NwYWNlT3B0aW9uczogYW55ID0ge1xuICAgIG5hbWU6ICd3b3Jrc3BhY2UnLFxuICAgIG5ld1Byb2plY3RSb290OiAncHJvamVjdHMnLFxuICAgIHZlcnNpb246ICc2LjAuMCcsXG4gIH07XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICBjb25zdCBhcHBPcHRpb25zOiBhbnkgPSB7XG4gICAgbmFtZTogJ2JhcicsXG4gICAgaW5saW5lU3R5bGU6IGZhbHNlLFxuICAgIGlubGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICByb3V0aW5nOiBmYWxzZSxcbiAgICBzdHlsZTogJ2NzcycsXG4gICAgc2tpcFRlc3RzOiBmYWxzZSxcbiAgfTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHBUcmVlID0gc2NoZW1hdGljUnVubmVyLnJ1bkV4dGVybmFsU2NoZW1hdGljKCdAc2NoZW1hdGljcy9hbmd1bGFyJywgJ3dvcmtzcGFjZScsIHdvcmtzcGFjZU9wdGlvbnMpO1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuRXh0ZXJuYWxTY2hlbWF0aWMoJ0BzY2hlbWF0aWNzL2FuZ3VsYXInLCAnYXBwbGljYXRpb24nLCBhcHBPcHRpb25zLCBhcHBUcmVlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBydW4gdGhlIHNlcnZpY2Ugd29ya2VyIHNjaGVtYXRpYycsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctYWRkJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGNvbmZpZ1RleHQgPSB0cmVlLnJlYWRDb250ZW50KCcvYW5ndWxhci5qc29uJyk7XG4gICAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShjb25maWdUZXh0KTtcbiAgICBjb25zdCBzd0ZsYWcgPSBjb25maWcucHJvamVjdHMuYmFyLmFyY2hpdGVjdC5idWlsZC5jb25maWd1cmF0aW9ucy5wcm9kdWN0aW9uLnNlcnZpY2VXb3JrZXI7XG4gICAgZXhwZWN0KHN3RmxhZykudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgaWNvbiBmaWxlcycsICgpID0+IHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gWzcyLCA5NiwgMTI4LCAxNDQsIDE1MiwgMTkyLCAzODQsIDUxMl07XG4gICAgY29uc3QgaWNvblBhdGggPSAnL3Byb2plY3RzL2Jhci9zcmMvYXNzZXRzL2ljb25zL2ljb24tJztcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctYWRkJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGRpbWVuc2lvbnMuZm9yRWFjaChkID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBgJHtpY29uUGF0aH0ke2R9eCR7ZH0ucG5nYDtcbiAgICAgIGV4cGVjdCh0cmVlLmV4aXN0cyhwYXRoKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBtYW5pZmVzdCBmaWxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCduZy1hZGQnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgZXhwZWN0KHRyZWUuZXhpc3RzKCcvcHJvamVjdHMvYmFyL3NyYy9tYW5pZmVzdC5qc29uJykpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IHRoZSBuYW1lICYgc2hvcnRfbmFtZSBpbiB0aGUgbWFuaWZlc3QgZmlsZScsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctYWRkJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IG1hbmlmZXN0VGV4dCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL21hbmlmZXN0Lmpzb24nKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IEpTT04ucGFyc2UobWFuaWZlc3RUZXh0KTtcbiAgICBleHBlY3QobWFuaWZlc3QubmFtZSkudG9FcXVhbChkZWZhdWx0T3B0aW9ucy50aXRsZSk7XG4gICAgZXhwZWN0KG1hbmlmZXN0LnNob3J0X25hbWUpLnRvRXF1YWwoZGVmYXVsdE9wdGlvbnMudGl0bGUpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCB0aGUgbmFtZSAmIHNob3J0X25hbWUgaW4gdGhlIG1hbmlmZXN0IGZpbGUgd2hlbiBubyB0aXRsZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gey4uLmRlZmF1bHRPcHRpb25zLCB0aXRsZTogdW5kZWZpbmVkfTtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctYWRkJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgbWFuaWZlc3RUZXh0ID0gdHJlZS5yZWFkQ29udGVudCgnL3Byb2plY3RzL2Jhci9zcmMvbWFuaWZlc3QuanNvbicpO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gSlNPTi5wYXJzZShtYW5pZmVzdFRleHQpO1xuICAgIGV4cGVjdChtYW5pZmVzdC5uYW1lKS50b0VxdWFsKGRlZmF1bHRPcHRpb25zLnByb2plY3QpO1xuICAgIGV4cGVjdChtYW5pZmVzdC5zaG9ydF9uYW1lKS50b0VxdWFsKGRlZmF1bHRPcHRpb25zLnByb2plY3QpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgaW5kZXggZmlsZScsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctYWRkJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KCdwcm9qZWN0cy9iYXIvc3JjL2luZGV4Lmh0bWwnKTtcblxuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC88bGluayByZWw9XCJtYW5pZmVzdFwiIGhyZWY9XCJtYW5pZmVzdC5qc29uXCI+Lyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goLzxtZXRhIG5hbWU9XCJ0aGVtZS1jb2xvclwiIGNvbnRlbnQ9XCIjMTk3NmQyXCI+Lyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpXG4gICAgICAudG9NYXRjaCgvPG5vc2NyaXB0PlBsZWFzZSBlbmFibGUgSmF2YVNjcmlwdCB0byBjb250aW51ZSB1c2luZyB0aGlzIGFwcGxpY2F0aW9uLjxcXC9ub3NjcmlwdD4vKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1cGRhdGUgdGhlIGJ1aWxkIGFuZCB0ZXN0IGFzc2V0cyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCduZy1hZGQnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgY29uZmlnVGV4dCA9IHRyZWUucmVhZENvbnRlbnQoJy9hbmd1bGFyLmpzb24nKTtcbiAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKGNvbmZpZ1RleHQpO1xuICAgIGNvbnN0IGFyY2hpdGVjdCA9IGNvbmZpZy5wcm9qZWN0cy5iYXIuYXJjaGl0ZWN0O1xuICAgIFsnYnVpbGQnLCAndGVzdCddLmZvckVhY2goKHRhcmdldCkgPT4ge1xuICAgICAgZXhwZWN0KGFyY2hpdGVjdFt0YXJnZXRdLm9wdGlvbnMuYXNzZXRzKS50b0NvbnRhaW4oJ3Byb2plY3RzL2Jhci9zcmMvbWFuaWZlc3QuanNvbicpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19