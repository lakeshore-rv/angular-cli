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
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const test_1 = require("../../angular/utility/test");
const latest_versions_1 = require("../utility/latest-versions");
function getJsonFileContent(tree, path) {
    return JSON.parse(tree.readContent(path));
}
// tslint:disable:max-line-length
describe('Library Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/ng_packagr', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        entryFile: 'my_index',
        skipPackageJson: false,
        skipTsConfig: false,
    };
    const workspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    };
    let workspaceTree;
    beforeEach(() => {
        workspaceTree = schematicRunner.runSchematic('workspace', workspaceOptions);
    });
    it('should create files', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const files = tree.files;
        expect(files.indexOf('/projects/foo/karma.conf.js')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/ng-package.json')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/package.json')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/tslint.json')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/test.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/my_index.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/lib/foo.module.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/lib/foo.component.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/lib/foo.component.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/lib/foo.service.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/foo/src/lib/foo.service.ts')).toBeGreaterThanOrEqual(0);
    });
    it('should create a package.json named "foo"', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const fileContent = test_1.getFileContent(tree, '/projects/foo/package.json');
        expect(fileContent).toMatch(/"name": "foo"/);
    });
    it('should create a tsconfig for library', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const fileContent = getJsonFileContent(tree, '/projects/foo/tsconfig.lib.json');
        expect(fileContent).toBeDefined();
    });
    it('should create a ng-package.json with ngPackage conf', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const fileContent = getJsonFileContent(tree, '/projects/foo/ng-package.json');
        expect(fileContent.lib).toBeDefined();
        expect(fileContent.lib.entryFile).toEqual('src/my_index.ts');
        expect(fileContent.deleteDestPath).toEqual(false);
        expect(fileContent.dest).toEqual('../../dist/foo');
    });
    it('should use default value for baseDir and entryFile', () => {
        const tree = schematicRunner.runSchematic('library', {
            name: 'foobar',
        }, workspaceTree);
        expect(tree.files.indexOf('/projects/foobar/src/public_api.ts')).toBeGreaterThanOrEqual(0);
    });
    it(`should add library to workspace`, () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const workspace = getJsonFileContent(tree, '/angular.json');
        expect(workspace.projects.foo).toBeDefined();
        expect(workspace.defaultProject).toBe('foo');
    });
    it('should set the prefix to lib if none is set', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const workspace = JSON.parse(tree.readContent('/angular.json'));
        expect(workspace.projects.foo.prefix).toEqual('lib');
    });
    it('should set the prefix correctly', () => {
        const options = Object.assign({}, defaultOptions, { prefix: 'pre' });
        const tree = schematicRunner.runSchematic('library', options, workspaceTree);
        const workspace = JSON.parse(tree.readContent('/angular.json'));
        expect(workspace.projects.foo.prefix).toEqual('pre');
    });
    it('should handle a pascalCasedName', () => {
        const options = Object.assign({}, defaultOptions, { name: 'pascalCasedName' });
        const tree = schematicRunner.runSchematic('library', options, workspaceTree);
        const config = getJsonFileContent(tree, '/angular.json');
        const project = config.projects.pascalCasedName;
        expect(project).toBeDefined();
        expect(project.root).toEqual('projects/pascal-cased-name');
        const svcContent = tree.readContent('/projects/pascal-cased-name/src/lib/pascal-cased-name.service.ts');
        expect(svcContent).toMatch(/providedIn: 'root'/);
    });
    it('should export the component in the NgModule', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const fileContent = test_1.getFileContent(tree, '/projects/foo/src/lib/foo.module.ts');
        expect(fileContent).toContain('exports: [FooComponent]');
    });
    it('should set the right path and prefix in the tslint file', () => {
        const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const path = '/projects/foo/tslint.json';
        const content = JSON.parse(tree.readContent(path));
        expect(content.extends).toMatch('../../tslint.json');
        expect(content.rules['directive-selector'][2]).toMatch('lib');
        expect(content.rules['component-selector'][2]).toMatch('lib');
    });
    describe(`update package.json`, () => {
        it(`should add ng-packagr to devDependencies`, () => {
            const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
            const packageJson = getJsonFileContent(tree, 'package.json');
            expect(packageJson.devDependencies['ng-packagr']).toEqual('^3.0.0');
            expect(packageJson.devDependencies['@angular-devkit/build-ng-packagr'])
                .toEqual(latest_versions_1.latestVersions.DevkitBuildNgPackagr);
        });
        it('should use the latest known versions in package.json', () => {
            const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
            const pkg = JSON.parse(tree.readContent('/package.json'));
            expect(pkg.devDependencies['@angular/compiler-cli']).toEqual(latest_versions_1.latestVersions.Angular);
            expect(pkg.devDependencies['typescript']).toEqual(latest_versions_1.latestVersions.TypeScript);
        });
        it(`should not override existing users dependencies`, () => {
            const oldPackageJson = workspaceTree.readContent('package.json');
            workspaceTree.overwrite('package.json', oldPackageJson.replace(`"typescript": "${latest_versions_1.latestVersions.TypeScript}"`, `"typescript": "~2.5.2"`));
            const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
            const packageJson = getJsonFileContent(tree, 'package.json');
            expect(packageJson.devDependencies.typescript).toEqual('~2.5.2');
        });
        it(`should not modify the file when --skipPackageJson`, () => {
            const tree = schematicRunner.runSchematic('library', {
                name: 'foo',
                skipPackageJson: true,
            }, workspaceTree);
            const packageJson = getJsonFileContent(tree, 'package.json');
            expect(packageJson.devDependencies['ng-packagr']).toBeUndefined();
            expect(packageJson.devDependencies['@angular-devkit/build-angular']).toBeUndefined();
        });
    });
    describe(`update tsconfig.json`, () => {
        it(`should add paths mapping to empty tsconfig`, () => {
            const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
            const tsConfigJson = getJsonFileContent(tree, 'tsconfig.json');
            expect(tsConfigJson.compilerOptions.paths.foo).toBeTruthy();
            expect(tsConfigJson.compilerOptions.paths.foo.length).toEqual(1);
            expect(tsConfigJson.compilerOptions.paths.foo[0]).toEqual('dist/foo');
            expect(tsConfigJson.compilerOptions.paths['foo/*']).toBeTruthy();
            expect(tsConfigJson.compilerOptions.paths['foo/*'].length).toEqual(1);
            expect(tsConfigJson.compilerOptions.paths['foo/*'][0]).toEqual('dist/foo/*');
        });
        it(`should append to existing paths mappings`, () => {
            workspaceTree.overwrite('tsconfig.json', JSON.stringify({
                compilerOptions: {
                    paths: {
                        'unrelated': ['./something/else.ts'],
                        'foo': ['libs/*'],
                    },
                },
            }));
            const tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
            const tsConfigJson = getJsonFileContent(tree, 'tsconfig.json');
            expect(tsConfigJson.compilerOptions.paths.foo).toBeTruthy();
            expect(tsConfigJson.compilerOptions.paths.foo.length).toEqual(2);
            expect(tsConfigJson.compilerOptions.paths.foo[1]).toEqual('dist/foo');
        });
        it(`should not modify the file when --skipTsConfig`, () => {
            const tree = schematicRunner.runSchematic('library', {
                name: 'foo',
                skipTsConfig: true,
            }, workspaceTree);
            const tsConfigJson = getJsonFileContent(tree, 'tsconfig.json');
            expect(tsConfigJson.compilerOptions.paths).toBeUndefined();
        });
    });
    it('should generate inside of a library', () => {
        let tree = schematicRunner.runSchematic('library', defaultOptions, workspaceTree);
        const componentOptions = {
            name: 'comp',
            project: 'foo',
        };
        tree = schematicRunner.runSchematic('component', componentOptions, tree);
        expect(tree.exists('/projects/foo/src/lib/comp/comp.component.ts')).toBe(true);
    });
    it(`should support creating scoped libraries`, () => {
        const scopedName = '@myscope/mylib';
        const options = Object.assign({}, defaultOptions, { name: scopedName });
        const tree = schematicRunner.runSchematic('library', options, workspaceTree);
        const pkgJsonPath = '/projects/myscope/mylib/package.json';
        expect(tree.files).toContain(pkgJsonPath);
        expect(tree.files).toContain('/projects/myscope/mylib/src/lib/mylib.module.ts');
        expect(tree.files).toContain('/projects/myscope/mylib/src/lib/mylib.component.ts');
        const pkgJson = JSON.parse(tree.readContent(pkgJsonPath));
        expect(pkgJson.name).toEqual(scopedName);
        const tsConfigJson = JSON.parse(tree.readContent('/projects/myscope/mylib/tsconfig.spec.json'));
        expect(tsConfigJson.extends).toEqual('../../../tsconfig.json');
        const cfg = JSON.parse(tree.readContent('/angular.json'));
        expect(cfg.projects['@myscope/mylib']).toBeDefined();
        const rootTsCfg = JSON.parse(tree.readContent('/tsconfig.json'));
        expect(rootTsCfg.compilerOptions.paths['@myscope/mylib']).toEqual(['dist/myscope/mylib']);
    });
    it(`should dasherize scoped libraries`, () => {
        const scopedName = '@myScope/myLib';
        const expectedScopeName = '@my-scope/my-lib';
        const expectedFolderName = 'my-scope/my-lib';
        const options = Object.assign({}, defaultOptions, { name: scopedName });
        const tree = schematicRunner.runSchematic('library', options, workspaceTree);
        const pkgJsonPath = '/projects/my-scope/my-lib/package.json';
        expect(tree.readContent(pkgJsonPath)).toContain(expectedScopeName);
        const ngPkgJsonPath = '/projects/my-scope/my-lib/ng-package.json';
        expect(tree.readContent(ngPkgJsonPath)).toContain(expectedFolderName);
        const pkgJson = JSON.parse(tree.readContent(pkgJsonPath));
        expect(pkgJson.name).toEqual(expectedScopeName);
        const cfg = JSON.parse(tree.readContent('/angular.json'));
        expect(cfg.projects['@myScope/myLib']).toBeDefined();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL2xpYnJhcnkvaW5kZXhfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQyxnRUFBdUY7QUFDdkYsNkJBQTZCO0FBQzdCLHFEQUE0RDtBQUU1RCxnRUFBNEQ7QUFJNUQsNEJBQTRCLElBQWtCLEVBQUUsSUFBWTtJQUMxRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxpQ0FBaUM7QUFDakMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxNQUFNLGVBQWUsR0FBRyxJQUFJLDZCQUFtQixDQUM3Qyx3QkFBd0IsRUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FDM0MsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUEwQjtRQUM1QyxJQUFJLEVBQUUsS0FBSztRQUNYLFNBQVMsRUFBRSxVQUFVO1FBQ3JCLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLFlBQVksRUFBRSxLQUFLO0tBQ3BCLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFxQjtRQUN6QyxJQUFJLEVBQUUsV0FBVztRQUNqQixjQUFjLEVBQUUsVUFBVTtRQUMxQixPQUFPLEVBQUUsT0FBTztLQUNqQixDQUFDO0lBRUYsSUFBSSxhQUEyQixDQUFDO0lBQ2hDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxhQUFhLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7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QUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXRFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cbmltcG9ydCB7IFNjaGVtYXRpY1Rlc3RSdW5uZXIsIFVuaXRUZXN0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rlc3RpbmcnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdldEZpbGVDb250ZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci91dGlsaXR5L3Rlc3QnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIENvbXBvbmVudE9wdGlvbnMgfSBmcm9tICcuLi9jb21wb25lbnQvc2NoZW1hJztcbmltcG9ydCB7IGxhdGVzdFZlcnNpb25zIH0gZnJvbSAnLi4vdXRpbGl0eS9sYXRlc3QtdmVyc2lvbnMnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIFdvcmtzcGFjZU9wdGlvbnMgfSBmcm9tICcuLi93b3Jrc3BhY2Uvc2NoZW1hJztcbmltcG9ydCB7IFNjaGVtYSBhcyBHZW5lcmF0ZUxpYnJhcnlTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSc7XG5cbmZ1bmN0aW9uIGdldEpzb25GaWxlQ29udGVudCh0cmVlOiBVbml0VGVzdFRyZWUsIHBhdGg6IHN0cmluZykge1xuICByZXR1cm4gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KHBhdGgpKTtcbn1cblxuLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG5kZXNjcmliZSgnTGlicmFyeSBTY2hlbWF0aWMnLCAoKSA9PiB7XG4gIGNvbnN0IHNjaGVtYXRpY1J1bm5lciA9IG5ldyBTY2hlbWF0aWNUZXN0UnVubmVyKFxuICAgICdAc2NoZW1hdGljcy9uZ19wYWNrYWdyJyxcbiAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vY29sbGVjdGlvbi5qc29uJyksXG4gICk7XG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBHZW5lcmF0ZUxpYnJhcnlTY2hlbWEgPSB7XG4gICAgbmFtZTogJ2ZvbycsXG4gICAgZW50cnlGaWxlOiAnbXlfaW5kZXgnLFxuICAgIHNraXBQYWNrYWdlSnNvbjogZmFsc2UsXG4gICAgc2tpcFRzQ29uZmlnOiBmYWxzZSxcbiAgfTtcbiAgY29uc3Qgd29ya3NwYWNlT3B0aW9uczogV29ya3NwYWNlT3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnd29ya3NwYWNlJyxcbiAgICBuZXdQcm9qZWN0Um9vdDogJ3Byb2plY3RzJyxcbiAgICB2ZXJzaW9uOiAnNi4wLjAnLFxuICB9O1xuXG4gIGxldCB3b3Jrc3BhY2VUcmVlOiBVbml0VGVzdFRyZWU7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdvcmtzcGFjZVRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd3b3Jrc3BhY2UnLCB3b3Jrc3BhY2VPcHRpb25zKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgZmlsZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgZmlsZXMgPSB0cmVlLmZpbGVzO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvZm9vL2thcm1hLmNvbmYuanMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvby9uZy1wYWNrYWdlLmpzb24nKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvby9wYWNrYWdlLmpzb24nKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvby90c2xpbnQuanNvbicpKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvZm9vL3NyYy90ZXN0LnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9mb28vc3JjL215X2luZGV4LnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9mb28vc3JjL2xpYi9mb28ubW9kdWxlLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9mb28vc3JjL2xpYi9mb28uY29tcG9uZW50LnNwZWMudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvby9zcmMvbGliL2Zvby5jb21wb25lbnQudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvby9zcmMvbGliL2Zvby5zZXJ2aWNlLnNwZWMudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvby9zcmMvbGliL2Zvby5zZXJ2aWNlLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIGEgcGFja2FnZS5qc29uIG5hbWVkIFwiZm9vXCInLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBnZXRGaWxlQ29udGVudCh0cmVlLCAnL3Byb2plY3RzL2Zvby9wYWNrYWdlLmpzb24nKTtcbiAgICBleHBlY3QoZmlsZUNvbnRlbnQpLnRvTWF0Y2goL1wibmFtZVwiOiBcImZvb1wiLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIGEgdHNjb25maWcgZm9yIGxpYnJhcnknLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBnZXRKc29uRmlsZUNvbnRlbnQodHJlZSwgJy9wcm9qZWN0cy9mb28vdHNjb25maWcubGliLmpzb24nKTtcbiAgICBleHBlY3QoZmlsZUNvbnRlbnQpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIGEgbmctcGFja2FnZS5qc29uIHdpdGggbmdQYWNrYWdlIGNvbmYnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBnZXRKc29uRmlsZUNvbnRlbnQodHJlZSwgJy9wcm9qZWN0cy9mb28vbmctcGFja2FnZS5qc29uJyk7XG4gICAgZXhwZWN0KGZpbGVDb250ZW50LmxpYikudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoZmlsZUNvbnRlbnQubGliLmVudHJ5RmlsZSkudG9FcXVhbCgnc3JjL215X2luZGV4LnRzJyk7XG4gICAgZXhwZWN0KGZpbGVDb250ZW50LmRlbGV0ZURlc3RQYXRoKS50b0VxdWFsKGZhbHNlKTtcbiAgICBleHBlY3QoZmlsZUNvbnRlbnQuZGVzdCkudG9FcXVhbCgnLi4vLi4vZGlzdC9mb28nKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCB2YWx1ZSBmb3IgYmFzZURpciBhbmQgZW50cnlGaWxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5Jywge1xuICAgICAgbmFtZTogJ2Zvb2JhcicsXG4gICAgfSwgd29ya3NwYWNlVHJlZSk7XG4gICAgZXhwZWN0KHRyZWUuZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Zvb2Jhci9zcmMvcHVibGljX2FwaS50cycpKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICB9KTtcblxuICBpdChgc2hvdWxkIGFkZCBsaWJyYXJ5IHRvIHdvcmtzcGFjZWAsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIGRlZmF1bHRPcHRpb25zLCB3b3Jrc3BhY2VUcmVlKTtcblxuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldEpzb25GaWxlQ29udGVudCh0cmVlLCAnL2FuZ3VsYXIuanNvbicpO1xuICAgIGV4cGVjdCh3b3Jrc3BhY2UucHJvamVjdHMuZm9vKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdCh3b3Jrc3BhY2UuZGVmYXVsdFByb2plY3QpLnRvQmUoJ2ZvbycpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCB0aGUgcHJlZml4IHRvIGxpYiBpZiBub25lIGlzIHNldCcsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIGRlZmF1bHRPcHRpb25zLCB3b3Jrc3BhY2VUcmVlKTtcblxuICAgIGNvbnN0IHdvcmtzcGFjZSA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCgnL2FuZ3VsYXIuanNvbicpKTtcbiAgICBleHBlY3Qod29ya3NwYWNlLnByb2plY3RzLmZvby5wcmVmaXgpLnRvRXF1YWwoJ2xpYicpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCB0aGUgcHJlZml4IGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgcHJlZml4OiAncHJlJyB9O1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5Jywgb3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG5cbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9hbmd1bGFyLmpzb24nKSk7XG4gICAgZXhwZWN0KHdvcmtzcGFjZS5wcm9qZWN0cy5mb28ucHJlZml4KS50b0VxdWFsKCdwcmUnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYSBwYXNjYWxDYXNlZE5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgbmFtZTogJ3Bhc2NhbENhc2VkTmFtZSd9O1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5Jywgb3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgY29uZmlnID0gZ2V0SnNvbkZpbGVDb250ZW50KHRyZWUsICcvYW5ndWxhci5qc29uJyk7XG4gICAgY29uc3QgcHJvamVjdCA9IGNvbmZpZy5wcm9qZWN0cy5wYXNjYWxDYXNlZE5hbWU7XG4gICAgZXhwZWN0KHByb2plY3QpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KHByb2plY3Qucm9vdCkudG9FcXVhbCgncHJvamVjdHMvcGFzY2FsLWNhc2VkLW5hbWUnKTtcbiAgICBjb25zdCBzdmNDb250ZW50ID0gdHJlZS5yZWFkQ29udGVudCgnL3Byb2plY3RzL3Bhc2NhbC1jYXNlZC1uYW1lL3NyYy9saWIvcGFzY2FsLWNhc2VkLW5hbWUuc2VydmljZS50cycpO1xuICAgIGV4cGVjdChzdmNDb250ZW50KS50b01hdGNoKC9wcm92aWRlZEluOiAncm9vdCcvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBleHBvcnQgdGhlIGNvbXBvbmVudCBpbiB0aGUgTmdNb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBnZXRGaWxlQ29udGVudCh0cmVlLCAnL3Byb2plY3RzL2Zvby9zcmMvbGliL2Zvby5tb2R1bGUudHMnKTtcbiAgICBleHBlY3QoZmlsZUNvbnRlbnQpLnRvQ29udGFpbignZXhwb3J0czogW0Zvb0NvbXBvbmVudF0nKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgdGhlIHJpZ2h0IHBhdGggYW5kIHByZWZpeCBpbiB0aGUgdHNsaW50IGZpbGUnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgY29uc3QgcGF0aCA9ICcvcHJvamVjdHMvZm9vL3RzbGludC5qc29uJztcbiAgICBjb25zdCBjb250ZW50ID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KHBhdGgpKTtcbiAgICBleHBlY3QoY29udGVudC5leHRlbmRzKS50b01hdGNoKCcuLi8uLi90c2xpbnQuanNvbicpO1xuICAgIGV4cGVjdChjb250ZW50LnJ1bGVzWydkaXJlY3RpdmUtc2VsZWN0b3InXVsyXSkudG9NYXRjaCgnbGliJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQucnVsZXNbJ2NvbXBvbmVudC1zZWxlY3RvciddWzJdKS50b01hdGNoKCdsaWInKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoYHVwZGF0ZSBwYWNrYWdlLmpzb25gLCAoKSA9PiB7XG4gICAgaXQoYHNob3VsZCBhZGQgbmctcGFja2FnciB0byBkZXZEZXBlbmRlbmNpZXNgLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIGRlZmF1bHRPcHRpb25zLCB3b3Jrc3BhY2VUcmVlKTtcblxuICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBnZXRKc29uRmlsZUNvbnRlbnQodHJlZSwgJ3BhY2thZ2UuanNvbicpO1xuICAgICAgZXhwZWN0KHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llc1snbmctcGFja2FnciddKS50b0VxdWFsKCdeMy4wLjAnKTtcbiAgICAgIGV4cGVjdChwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXNbJ0Bhbmd1bGFyLWRldmtpdC9idWlsZC1uZy1wYWNrYWdyJ10pXG4gICAgICAgIC50b0VxdWFsKGxhdGVzdFZlcnNpb25zLkRldmtpdEJ1aWxkTmdQYWNrYWdyKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHRoZSBsYXRlc3Qga25vd24gdmVyc2lvbnMgaW4gcGFja2FnZS5qc29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2xpYnJhcnknLCBkZWZhdWx0T3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG4gICAgICBjb25zdCBwa2cgPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKSk7XG4gICAgICBleHBlY3QocGtnLmRldkRlcGVuZGVuY2llc1snQGFuZ3VsYXIvY29tcGlsZXItY2xpJ10pLnRvRXF1YWwobGF0ZXN0VmVyc2lvbnMuQW5ndWxhcik7XG4gICAgICBleHBlY3QocGtnLmRldkRlcGVuZGVuY2llc1sndHlwZXNjcmlwdCddKS50b0VxdWFsKGxhdGVzdFZlcnNpb25zLlR5cGVTY3JpcHQpO1xuICAgIH0pO1xuXG4gICAgaXQoYHNob3VsZCBub3Qgb3ZlcnJpZGUgZXhpc3RpbmcgdXNlcnMgZGVwZW5kZW5jaWVzYCwgKCkgPT4ge1xuICAgICAgY29uc3Qgb2xkUGFja2FnZUpzb24gPSB3b3Jrc3BhY2VUcmVlLnJlYWRDb250ZW50KCdwYWNrYWdlLmpzb24nKTtcbiAgICAgIHdvcmtzcGFjZVRyZWUub3ZlcndyaXRlKCdwYWNrYWdlLmpzb24nLCBvbGRQYWNrYWdlSnNvbi5yZXBsYWNlKFxuICAgICAgICBgXCJ0eXBlc2NyaXB0XCI6IFwiJHtsYXRlc3RWZXJzaW9ucy5UeXBlU2NyaXB0fVwiYCxcbiAgICAgICAgYFwidHlwZXNjcmlwdFwiOiBcIn4yLjUuMlwiYCxcbiAgICAgICkpO1xuXG4gICAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIGRlZmF1bHRPcHRpb25zLCB3b3Jrc3BhY2VUcmVlKTtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gZ2V0SnNvbkZpbGVDb250ZW50KHRyZWUsICdwYWNrYWdlLmpzb24nKTtcbiAgICAgIGV4cGVjdChwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMudHlwZXNjcmlwdCkudG9FcXVhbCgnfjIuNS4yJyk7XG4gICAgfSk7XG5cbiAgICBpdChgc2hvdWxkIG5vdCBtb2RpZnkgdGhlIGZpbGUgd2hlbiAtLXNraXBQYWNrYWdlSnNvbmAsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5Jywge1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgc2tpcFBhY2thZ2VKc29uOiB0cnVlLFxuICAgICAgfSwgd29ya3NwYWNlVHJlZSk7XG5cbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gZ2V0SnNvbkZpbGVDb250ZW50KHRyZWUsICdwYWNrYWdlLmpzb24nKTtcbiAgICAgIGV4cGVjdChwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXNbJ25nLXBhY2thZ3InXSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llc1snQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInXSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShgdXBkYXRlIHRzY29uZmlnLmpzb25gLCAoKSA9PiB7XG4gICAgaXQoYHNob3VsZCBhZGQgcGF0aHMgbWFwcGluZyB0byBlbXB0eSB0c2NvbmZpZ2AsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5JywgZGVmYXVsdE9wdGlvbnMsIHdvcmtzcGFjZVRyZWUpO1xuXG4gICAgICBjb25zdCB0c0NvbmZpZ0pzb24gPSBnZXRKc29uRmlsZUNvbnRlbnQodHJlZSwgJ3RzY29uZmlnLmpzb24nKTtcbiAgICAgIGV4cGVjdCh0c0NvbmZpZ0pzb24uY29tcGlsZXJPcHRpb25zLnBhdGhzLmZvbykudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KHRzQ29uZmlnSnNvbi5jb21waWxlck9wdGlvbnMucGF0aHMuZm9vLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIGV4cGVjdCh0c0NvbmZpZ0pzb24uY29tcGlsZXJPcHRpb25zLnBhdGhzLmZvb1swXSkudG9FcXVhbCgnZGlzdC9mb28nKTtcbiAgICAgIGV4cGVjdCh0c0NvbmZpZ0pzb24uY29tcGlsZXJPcHRpb25zLnBhdGhzWydmb28vKiddKS50b0JlVHJ1dGh5KCk7XG4gICAgICBleHBlY3QodHNDb25maWdKc29uLmNvbXBpbGVyT3B0aW9ucy5wYXRoc1snZm9vLyonXS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBleHBlY3QodHNDb25maWdKc29uLmNvbXBpbGVyT3B0aW9ucy5wYXRoc1snZm9vLyonXVswXSkudG9FcXVhbCgnZGlzdC9mb28vKicpO1xuICAgIH0pO1xuXG4gICAgaXQoYHNob3VsZCBhcHBlbmQgdG8gZXhpc3RpbmcgcGF0aHMgbWFwcGluZ3NgLCAoKSA9PiB7XG4gICAgICB3b3Jrc3BhY2VUcmVlLm92ZXJ3cml0ZSgndHNjb25maWcuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICd1bnJlbGF0ZWQnOiBbJy4vc29tZXRoaW5nL2Vsc2UudHMnXSxcbiAgICAgICAgICAgICdmb28nOiBbJ2xpYnMvKiddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIGRlZmF1bHRPcHRpb25zLCB3b3Jrc3BhY2VUcmVlKTtcblxuICAgICAgY29uc3QgdHNDb25maWdKc29uID0gZ2V0SnNvbkZpbGVDb250ZW50KHRyZWUsICd0c2NvbmZpZy5qc29uJyk7XG4gICAgICBleHBlY3QodHNDb25maWdKc29uLmNvbXBpbGVyT3B0aW9ucy5wYXRocy5mb28pLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0c0NvbmZpZ0pzb24uY29tcGlsZXJPcHRpb25zLnBhdGhzLmZvby5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICBleHBlY3QodHNDb25maWdKc29uLmNvbXBpbGVyT3B0aW9ucy5wYXRocy5mb29bMV0pLnRvRXF1YWwoJ2Rpc3QvZm9vJyk7XG4gICAgfSk7XG5cbiAgICBpdChgc2hvdWxkIG5vdCBtb2RpZnkgdGhlIGZpbGUgd2hlbiAtLXNraXBUc0NvbmZpZ2AsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5Jywge1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgc2tpcFRzQ29uZmlnOiB0cnVlLFxuICAgICAgfSwgd29ya3NwYWNlVHJlZSk7XG5cbiAgICAgIGNvbnN0IHRzQ29uZmlnSnNvbiA9IGdldEpzb25GaWxlQ29udGVudCh0cmVlLCAndHNjb25maWcuanNvbicpO1xuICAgICAgZXhwZWN0KHRzQ29uZmlnSnNvbi5jb21waWxlck9wdGlvbnMucGF0aHMpLnRvQmVVbmRlZmluZWQoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBnZW5lcmF0ZSBpbnNpZGUgb2YgYSBsaWJyYXJ5JywgKCkgPT4ge1xuICAgIGxldCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIGRlZmF1bHRPcHRpb25zLCB3b3Jrc3BhY2VUcmVlKTtcbiAgICBjb25zdCBjb21wb25lbnRPcHRpb25zOiBDb21wb25lbnRPcHRpb25zID0ge1xuICAgICAgbmFtZTogJ2NvbXAnLFxuICAgICAgcHJvamVjdDogJ2ZvbycsXG4gICAgfTtcbiAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50JywgY29tcG9uZW50T3B0aW9ucywgdHJlZSk7XG4gICAgZXhwZWN0KHRyZWUuZXhpc3RzKCcvcHJvamVjdHMvZm9vL3NyYy9saWIvY29tcC9jb21wLmNvbXBvbmVudC50cycpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdChgc2hvdWxkIHN1cHBvcnQgY3JlYXRpbmcgc2NvcGVkIGxpYnJhcmllc2AsICgpID0+IHtcbiAgICBjb25zdCBzY29wZWROYW1lID0gJ0BteXNjb3BlL215bGliJztcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgbmFtZTogc2NvcGVkTmFtZSB9O1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdsaWJyYXJ5Jywgb3B0aW9ucywgd29ya3NwYWNlVHJlZSk7XG5cbiAgICBjb25zdCBwa2dKc29uUGF0aCA9ICcvcHJvamVjdHMvbXlzY29wZS9teWxpYi9wYWNrYWdlLmpzb24nO1xuICAgIGV4cGVjdCh0cmVlLmZpbGVzKS50b0NvbnRhaW4ocGtnSnNvblBhdGgpO1xuICAgIGV4cGVjdCh0cmVlLmZpbGVzKS50b0NvbnRhaW4oJy9wcm9qZWN0cy9teXNjb3BlL215bGliL3NyYy9saWIvbXlsaWIubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KHRyZWUuZmlsZXMpLnRvQ29udGFpbignL3Byb2plY3RzL215c2NvcGUvbXlsaWIvc3JjL2xpYi9teWxpYi5jb21wb25lbnQudHMnKTtcblxuICAgIGNvbnN0IHBrZ0pzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQocGtnSnNvblBhdGgpKTtcbiAgICBleHBlY3QocGtnSnNvbi5uYW1lKS50b0VxdWFsKHNjb3BlZE5hbWUpO1xuXG4gICAgY29uc3QgdHNDb25maWdKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvbXlzY29wZS9teWxpYi90c2NvbmZpZy5zcGVjLmpzb24nKSk7XG4gICAgZXhwZWN0KHRzQ29uZmlnSnNvbi5leHRlbmRzKS50b0VxdWFsKCcuLi8uLi8uLi90c2NvbmZpZy5qc29uJyk7XG5cbiAgICBjb25zdCBjZmcgPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9hbmd1bGFyLmpzb24nKSk7XG4gICAgZXhwZWN0KGNmZy5wcm9qZWN0c1snQG15c2NvcGUvbXlsaWInXSkudG9CZURlZmluZWQoKTtcblxuICAgIGNvbnN0IHJvb3RUc0NmZyA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCgnL3RzY29uZmlnLmpzb24nKSk7XG4gICAgZXhwZWN0KHJvb3RUc0NmZy5jb21waWxlck9wdGlvbnMucGF0aHNbJ0BteXNjb3BlL215bGliJ10pLnRvRXF1YWwoWydkaXN0L215c2NvcGUvbXlsaWInXSk7XG4gIH0pO1xuXG4gIGl0KGBzaG91bGQgZGFzaGVyaXplIHNjb3BlZCBsaWJyYXJpZXNgLCAoKSA9PiB7XG4gICAgY29uc3Qgc2NvcGVkTmFtZSA9ICdAbXlTY29wZS9teUxpYic7XG4gICAgY29uc3QgZXhwZWN0ZWRTY29wZU5hbWUgPSAnQG15LXNjb3BlL215LWxpYic7XG4gICAgY29uc3QgZXhwZWN0ZWRGb2xkZXJOYW1lID0gJ215LXNjb3BlL215LWxpYic7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIG5hbWU6IHNjb3BlZE5hbWUgfTtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbGlicmFyeScsIG9wdGlvbnMsIHdvcmtzcGFjZVRyZWUpO1xuXG4gICAgY29uc3QgcGtnSnNvblBhdGggPSAnL3Byb2plY3RzL215LXNjb3BlL215LWxpYi9wYWNrYWdlLmpzb24nO1xuICAgIGV4cGVjdCh0cmVlLnJlYWRDb250ZW50KHBrZ0pzb25QYXRoKSkudG9Db250YWluKGV4cGVjdGVkU2NvcGVOYW1lKTtcblxuICAgIGNvbnN0IG5nUGtnSnNvblBhdGggPSAnL3Byb2plY3RzL215LXNjb3BlL215LWxpYi9uZy1wYWNrYWdlLmpzb24nO1xuICAgIGV4cGVjdCh0cmVlLnJlYWRDb250ZW50KG5nUGtnSnNvblBhdGgpKS50b0NvbnRhaW4oZXhwZWN0ZWRGb2xkZXJOYW1lKTtcblxuICAgIGNvbnN0IHBrZ0pzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQocGtnSnNvblBhdGgpKTtcbiAgICBleHBlY3QocGtnSnNvbi5uYW1lKS50b0VxdWFsKGV4cGVjdGVkU2NvcGVOYW1lKTtcblxuICAgIGNvbnN0IGNmZyA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCgnL2FuZ3VsYXIuanNvbicpKTtcbiAgICBleHBlY3QoY2ZnLnByb2plY3RzWydAbXlTY29wZS9teUxpYiddKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcbn0pO1xuIl19