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
const test_1 = require("../utility/test");
// tslint:disable:max-line-length
describe('Component Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        // path: 'src/app',
        inlineStyle: false,
        inlineTemplate: false,
        changeDetection: 'Default',
        styleext: 'css',
        spec: true,
        module: undefined,
        export: false,
        project: 'bar',
    };
    const workspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    };
    const appOptions = {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
        skipPackageJson: false,
    };
    let appTree;
    beforeEach(() => {
        appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
        appTree = schematicRunner.runSchematic('application', appOptions, appTree);
    });
    it('should create a component', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo/foo.component.css')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo.component.html')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo.component.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo.component.ts')).toBeGreaterThanOrEqual(0);
        const moduleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.component'/);
        expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooComponent\r?\n/m);
    });
    it('should set change detection to OnPush', () => {
        const options = Object.assign({}, defaultOptions, { changeDetection: 'OnPush' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const tsContent = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(tsContent).toMatch(/changeDetection: ChangeDetectionStrategy.OnPush/);
    });
    it('should not set view encapsulation', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const tsContent = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(tsContent).not.toMatch(/encapsulation: ViewEncapsulation/);
    });
    it('should set view encapsulation to Emulated', () => {
        const options = Object.assign({}, defaultOptions, { viewEncapsulation: 'Emulated' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const tsContent = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(tsContent).toMatch(/encapsulation: ViewEncapsulation.Emulated/);
    });
    it('should set view encapsulation to None', () => {
        const options = Object.assign({}, defaultOptions, { viewEncapsulation: 'None' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const tsContent = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(tsContent).toMatch(/encapsulation: ViewEncapsulation.None/);
    });
    it('should create a flat component', () => {
        const options = Object.assign({}, defaultOptions, { flat: true });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo.component.css')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo.component.html')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo.component.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo.component.ts')).toBeGreaterThanOrEqual(0);
    });
    it('should find the closest module', () => {
        const options = Object.assign({}, defaultOptions);
        const fooModule = '/projects/bar/src/app/foo/foo.module.ts';
        appTree.create(fooModule, `
      import { NgModule } from '@angular/core';

      @NgModule({
        imports: [],
        declarations: []
      })
      export class FooModule { }
    `);
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const fooModuleContent = tree.readContent(fooModule);
        expect(fooModuleContent).toMatch(/import { FooComponent } from '.\/foo.component'/);
    });
    it('should export the component', () => {
        const options = Object.assign({}, defaultOptions, { export: true });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(appModuleContent).toMatch(/exports: \[FooComponent\]/);
    });
    it('should set the entry component', () => {
        const options = Object.assign({}, defaultOptions, { entryComponent: true });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(appModuleContent).toMatch(/entryComponents: \[FooComponent\]/);
    });
    it('should import into a specified module', () => {
        const options = Object.assign({}, defaultOptions, { module: 'app.module.ts' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const appModule = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(appModule).toMatch(/import { FooComponent } from '.\/foo\/foo.component'/);
    });
    it('should fail if specified module does not exist', () => {
        const options = Object.assign({}, defaultOptions, { module: '/projects/bar/src/app.moduleXXX.ts' });
        let thrownError = null;
        try {
            schematicRunner.runSchematic('component', options, appTree);
        }
        catch (err) {
            thrownError = err;
        }
        expect(thrownError).toBeDefined();
    });
    it('should handle upper case paths', () => {
        const pathOption = 'projects/bar/src/app/SOME/UPPER/DIR';
        const options = Object.assign({}, defaultOptions, { path: pathOption });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        let files = tree.files;
        let root = `/${pathOption}/foo/foo.component`;
        expect(files.indexOf(`${root}.css`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.html`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.spec.ts`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.ts`)).toBeGreaterThanOrEqual(0);
        const options2 = Object.assign({}, options, { name: 'BAR' });
        const tree2 = schematicRunner.runSchematic('component', options2, tree);
        files = tree2.files;
        root = `/${pathOption}/bar/bar.component`;
        expect(files.indexOf(`${root}.css`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.html`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.spec.ts`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.ts`)).toBeGreaterThanOrEqual(0);
    });
    it('should create a component in a sub-directory', () => {
        const options = Object.assign({}, defaultOptions, { path: 'projects/bar/src/app/a/b/c' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const files = tree.files;
        const root = `/${options.path}/foo/foo.component`;
        expect(files.indexOf(`${root}.css`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.html`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.spec.ts`)).toBeGreaterThanOrEqual(0);
        expect(files.indexOf(`${root}.ts`)).toBeGreaterThanOrEqual(0);
    });
    it('should use the prefix', () => {
        const options = Object.assign({}, defaultOptions, { prefix: 'pre' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(content).toMatch(/selector: 'pre-foo'/);
    });
    it('should use the default project prefix if none is passed', () => {
        const options = Object.assign({}, defaultOptions, { prefix: undefined });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(content).toMatch(/selector: 'app-foo'/);
    });
    it('should use the supplied prefix if it is ""', () => {
        const options = Object.assign({}, defaultOptions, { prefix: '' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(content).toMatch(/selector: 'foo'/);
    });
    it('should respect the inlineTemplate option', () => {
        const options = Object.assign({}, defaultOptions, { inlineTemplate: true });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(content).toMatch(/template: /);
        expect(content).not.toMatch(/templateUrl: /);
        expect(tree.files.indexOf('/projects/bar/src/app/foo/foo.component.html')).toEqual(-1);
    });
    it('should respect the inlineStyle option', () => {
        const options = Object.assign({}, defaultOptions, { inlineStyle: true });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(content).toMatch(/styles: \[/);
        expect(content).not.toMatch(/styleUrls: /);
        expect(tree.files.indexOf('/projects/bar/src/app/foo/foo.component.css')).toEqual(-1);
    });
    it('should respect the styleext option', () => {
        const options = Object.assign({}, defaultOptions, { styleext: 'scss' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
        expect(content).toMatch(/styleUrls: \['.\/foo.component.scss/);
        expect(tree.files.indexOf('/projects/bar/src/app/foo/foo.component.scss'))
            .toBeGreaterThanOrEqual(0);
        expect(tree.files.indexOf('/projects/bar/src/app/foo/foo.component.css')).toEqual(-1);
    });
    it('should use the module flag even if the module is a routing module', () => {
        const routingFileName = 'app-routing.module.ts';
        const routingModulePath = `/projects/bar/src/app/${routingFileName}`;
        const newTree = test_1.createAppModule(appTree, routingModulePath);
        const options = Object.assign({}, defaultOptions, { module: routingFileName });
        const tree = schematicRunner.runSchematic('component', options, newTree);
        const content = tree.readContent(routingModulePath);
        expect(content).toMatch(/import { FooComponent } from '.\/foo\/foo.component/);
    });
    it('should handle a path in the name option', () => {
        const options = Object.assign({}, defaultOptions, { name: 'dir/test-component' });
        const tree = schematicRunner.runSchematic('component', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(content).toMatch(
        // tslint:disable-next-line:max-line-length
        /import { TestComponentComponent } from '\.\/dir\/test-component\/test-component.component'/);
    });
    it('should handle a path in the name and module options', () => {
        appTree = schematicRunner.runSchematic('module', { name: 'admin/module', project: 'bar' }, appTree);
        const options = Object.assign({}, defaultOptions, { name: 'other/test-component', module: 'admin/module' });
        appTree = schematicRunner.runSchematic('component', options, appTree);
        const content = appTree.readContent('/projects/bar/src/app/admin/module/module.module.ts');
        expect(content).toMatch(
        // tslint:disable-next-line:max-line-length
        /import { TestComponentComponent } from '..\/..\/other\/test-component\/test-component.component'/);
    });
    it('should create the right selector with a path in the name', () => {
        const options = Object.assign({}, defaultOptions, { name: 'sub/test' });
        appTree = schematicRunner.runSchematic('component', options, appTree);
        const content = appTree.readContent('/projects/bar/src/app/sub/test/test.component.ts');
        expect(content).toMatch(/selector: 'app-test'/);
    });
    it('should respect the sourceRoot value', () => {
        const config = JSON.parse(appTree.readContent('/angular.json'));
        config.projects.bar.sourceRoot = 'projects/bar/custom';
        appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));
        // should fail without a module in that dir
        expect(() => schematicRunner.runSchematic('component', defaultOptions, appTree)).toThrow();
        // move the module
        appTree.rename('/projects/bar/src/app/app.module.ts', '/projects/bar/custom/app/app.module.ts');
        appTree = schematicRunner.runSchematic('component', defaultOptions, appTree);
        expect(appTree.files.indexOf('/projects/bar/custom/app/foo/foo.component.ts'))
            .toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL2NvbXBvbmVudC9pbmRleF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWlDO0FBQ2pDLGdFQUF1RjtBQUN2Riw2QkFBNkI7QUFFN0IsMENBQWtEO0FBSWxELGlDQUFpQztBQUNqQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE1BQU0sZUFBZSxHQUFHLElBQUksNkJBQW1CLENBQzdDLHFCQUFxQixFQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUMzQyxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQXFCO1FBQ3ZDLElBQUksRUFBRSxLQUFLO1FBQ1gsbUJBQW1CO1FBQ25CLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLGVBQWUsRUFBRSxTQUFTO1FBQzFCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLElBQUk7UUFDVixNQUFNLEVBQUUsU0FBUztRQUNqQixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQztJQUdGLE1BQU0sZ0JBQWdCLEdBQXFCO1FBQ3pDLElBQUksRUFBRSxXQUFXO1FBQ2pCLGNBQWMsRUFBRSxVQUFVO1FBQzFCLE9BQU8sRUFBRSxPQUFPO0tBQ2pCLENBQUM7SUFFRixNQUFNLFVBQVUsR0FBdUI7UUFDckMsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsS0FBSztRQUNsQixjQUFjLEVBQUUsS0FBSztRQUNyQixPQUFPLEVBQUUsS0FBSztRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7UUFDaEIsZUFBZSxFQUFFLEtBQUs7S0FDdkIsQ0FB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TCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlOm5vLWJpZy1mdW5jdGlvblxuaW1wb3J0IHsgU2NoZW1hdGljVGVzdFJ1bm5lciwgVW5pdFRlc3RUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGVzdGluZyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIEFwcGxpY2F0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FwcGxpY2F0aW9uL3NjaGVtYSc7XG5pbXBvcnQgeyBjcmVhdGVBcHBNb2R1bGUgfSBmcm9tICcuLi91dGlsaXR5L3Rlc3QnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIFdvcmtzcGFjZU9wdGlvbnMgfSBmcm9tICcuLi93b3Jrc3BhY2Uvc2NoZW1hJztcbmltcG9ydCB7IFNjaGVtYSBhcyBDb21wb25lbnRPcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbmRlc2NyaWJlKCdDb21wb25lbnQgU2NoZW1hdGljJywgKCkgPT4ge1xuICBjb25zdCBzY2hlbWF0aWNSdW5uZXIgPSBuZXcgU2NoZW1hdGljVGVzdFJ1bm5lcihcbiAgICAnQHNjaGVtYXRpY3MvYW5ndWxhcicsXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2NvbGxlY3Rpb24uanNvbicpLFxuICApO1xuICBjb25zdCBkZWZhdWx0T3B0aW9uczogQ29tcG9uZW50T3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnZm9vJyxcbiAgICAvLyBwYXRoOiAnc3JjL2FwcCcsXG4gICAgaW5saW5lU3R5bGU6IGZhbHNlLFxuICAgIGlubGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246ICdEZWZhdWx0JyxcbiAgICBzdHlsZWV4dDogJ2NzcycsXG4gICAgc3BlYzogdHJ1ZSxcbiAgICBtb2R1bGU6IHVuZGVmaW5lZCxcbiAgICBleHBvcnQ6IGZhbHNlLFxuICAgIHByb2plY3Q6ICdiYXInLFxuICB9O1xuXG5cbiAgY29uc3Qgd29ya3NwYWNlT3B0aW9uczogV29ya3NwYWNlT3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnd29ya3NwYWNlJyxcbiAgICBuZXdQcm9qZWN0Um9vdDogJ3Byb2plY3RzJyxcbiAgICB2ZXJzaW9uOiAnNi4wLjAnLFxuICB9O1xuXG4gIGNvbnN0IGFwcE9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnYmFyJyxcbiAgICBpbmxpbmVTdHlsZTogZmFsc2UsXG4gICAgaW5saW5lVGVtcGxhdGU6IGZhbHNlLFxuICAgIHJvdXRpbmc6IGZhbHNlLFxuICAgIHN0eWxlOiAnY3NzJyxcbiAgICBza2lwVGVzdHM6IGZhbHNlLFxuICAgIHNraXBQYWNrYWdlSnNvbjogZmFsc2UsXG4gIH07XG4gIGxldCBhcHBUcmVlOiBVbml0VGVzdFRyZWU7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd3b3Jrc3BhY2UnLCB3b3Jrc3BhY2VPcHRpb25zKTtcbiAgICBhcHBUcmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnYXBwbGljYXRpb24nLCBhcHBPcHRpb25zLCBhcHBUcmVlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMgfTtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZXMgPSB0cmVlLmZpbGVzO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5jb21wb25lbnQuY3NzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC5odG1sJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC5zcGVjLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC50cycpKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGNvbnN0IG1vZHVsZUNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLm1vZHVsZS50cycpO1xuICAgIGV4cGVjdChtb2R1bGVDb250ZW50KS50b01hdGNoKC9pbXBvcnQuKkZvby4qZnJvbSAnLlxcL2Zvb1xcL2Zvby5jb21wb25lbnQnLyk7XG4gICAgZXhwZWN0KG1vZHVsZUNvbnRlbnQpLnRvTWF0Y2goL2RlY2xhcmF0aW9uczpcXHMqXFxbW15cXF1dKz8sXFxyP1xcblxccytGb29Db21wb25lbnRcXHI/XFxuL20pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCBjaGFuZ2UgZGV0ZWN0aW9uIHRvIE9uUHVzaCcsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgY2hhbmdlRGV0ZWN0aW9uOiAnT25QdXNoJyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IHRzQ29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC50cycpO1xuICAgIGV4cGVjdCh0c0NvbnRlbnQpLnRvTWF0Y2goL2NoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IHNldCB2aWV3IGVuY2Fwc3VsYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMgfTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCB0c0NvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5jb21wb25lbnQudHMnKTtcbiAgICBleHBlY3QodHNDb250ZW50KS5ub3QudG9NYXRjaCgvZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24vKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgdmlldyBlbmNhcHN1bGF0aW9uIHRvIEVtdWxhdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCB2aWV3RW5jYXBzdWxhdGlvbjogJ0VtdWxhdGVkJyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IHRzQ29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC50cycpO1xuICAgIGV4cGVjdCh0c0NvbnRlbnQpLnRvTWF0Y2goL2VuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IHZpZXcgZW5jYXBzdWxhdGlvbiB0byBOb25lJywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCB2aWV3RW5jYXBzdWxhdGlvbjogJ05vbmUnIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgdHNDb250ZW50ID0gdHJlZS5yZWFkQ29udGVudCgnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28uY29tcG9uZW50LnRzJyk7XG4gICAgZXhwZWN0KHRzQ29udGVudCkudG9NYXRjaCgvZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZS8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNyZWF0ZSBhIGZsYXQgY29tcG9uZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBmbGF0OiB0cnVlIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZXMgPSB0cmVlLmZpbGVzO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vLmNvbXBvbmVudC5jc3MnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby5jb21wb25lbnQuaHRtbCcpKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vLmNvbXBvbmVudC5zcGVjLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28uY29tcG9uZW50LnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZmluZCB0aGUgY2xvc2VzdCBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMgfTtcbiAgICBjb25zdCBmb29Nb2R1bGUgPSAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28ubW9kdWxlLnRzJztcbiAgICBhcHBUcmVlLmNyZWF0ZShmb29Nb2R1bGUsIGBcbiAgICAgIGltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbiAgICAgIEBOZ01vZHVsZSh7XG4gICAgICAgIGltcG9ydHM6IFtdLFxuICAgICAgICBkZWNsYXJhdGlvbnM6IFtdXG4gICAgICB9KVxuICAgICAgZXhwb3J0IGNsYXNzIEZvb01vZHVsZSB7IH1cbiAgICBgKTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmb29Nb2R1bGVDb250ZW50ID0gdHJlZS5yZWFkQ29udGVudChmb29Nb2R1bGUpO1xuICAgIGV4cGVjdChmb29Nb2R1bGVDb250ZW50KS50b01hdGNoKC9pbXBvcnQgeyBGb29Db21wb25lbnQgfSBmcm9tICcuXFwvZm9vLmNvbXBvbmVudCcvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBleHBvcnQgdGhlIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgZXhwb3J0OiB0cnVlIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgYXBwTW9kdWxlQ29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KGFwcE1vZHVsZUNvbnRlbnQpLnRvTWF0Y2goL2V4cG9ydHM6IFxcW0Zvb0NvbXBvbmVudFxcXS8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCB0aGUgZW50cnkgY29tcG9uZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBlbnRyeUNvbXBvbmVudDogdHJ1ZSB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGFwcE1vZHVsZUNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLm1vZHVsZS50cycpO1xuICAgIGV4cGVjdChhcHBNb2R1bGVDb250ZW50KS50b01hdGNoKC9lbnRyeUNvbXBvbmVudHM6IFxcW0Zvb0NvbXBvbmVudFxcXS8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGltcG9ydCBpbnRvIGEgc3BlY2lmaWVkIG1vZHVsZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgbW9kdWxlOiAnYXBwLm1vZHVsZS50cycgfTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBhcHBNb2R1bGUgPSB0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLm1vZHVsZS50cycpO1xuXG4gICAgZXhwZWN0KGFwcE1vZHVsZSkudG9NYXRjaCgvaW1wb3J0IHsgRm9vQ29tcG9uZW50IH0gZnJvbSAnLlxcL2Zvb1xcL2Zvby5jb21wb25lbnQnLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZmFpbCBpZiBzcGVjaWZpZWQgbW9kdWxlIGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBtb2R1bGU6ICcvcHJvamVjdHMvYmFyL3NyYy9hcHAubW9kdWxlWFhYLnRzJyB9O1xuICAgIGxldCB0aHJvd25FcnJvcjogRXJyb3IgfCBudWxsID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvd25FcnJvciA9IGVycjtcbiAgICB9XG4gICAgZXhwZWN0KHRocm93bkVycm9yKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSB1cHBlciBjYXNlIHBhdGhzJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhdGhPcHRpb24gPSAncHJvamVjdHMvYmFyL3NyYy9hcHAvU09NRS9VUFBFUi9ESVInO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBwYXRoOiBwYXRoT3B0aW9uIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgbGV0IGZpbGVzID0gdHJlZS5maWxlcztcbiAgICBsZXQgcm9vdCA9IGAvJHtwYXRoT3B0aW9ufS9mb28vZm9vLmNvbXBvbmVudGA7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoYCR7cm9vdH0uY3NzYCkpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoYCR7cm9vdH0uaHRtbGApKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKGAke3Jvb3R9LnNwZWMudHNgKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZihgJHtyb290fS50c2ApKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuXG4gICAgY29uc3Qgb3B0aW9uczIgPSB7IC4uLm9wdGlvbnMsIG5hbWU6ICdCQVInIH07XG4gICAgY29uc3QgdHJlZTIgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zMiwgdHJlZSk7XG4gICAgZmlsZXMgPSB0cmVlMi5maWxlcztcbiAgICByb290ID0gYC8ke3BhdGhPcHRpb259L2Jhci9iYXIuY29tcG9uZW50YDtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZihgJHtyb290fS5jc3NgKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZihgJHtyb290fS5odG1sYCkpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoYCR7cm9vdH0uc3BlYy50c2ApKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKGAke3Jvb3R9LnRzYCkpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIGEgY29tcG9uZW50IGluIGEgc3ViLWRpcmVjdG9yeScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgcGF0aDogJ3Byb2plY3RzL2Jhci9zcmMvYXBwL2EvYi9jJyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVzID0gdHJlZS5maWxlcztcbiAgICBjb25zdCByb290ID0gYC8ke29wdGlvbnMucGF0aH0vZm9vL2Zvby5jb21wb25lbnRgO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKGAke3Jvb3R9LmNzc2ApKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKGAke3Jvb3R9Lmh0bWxgKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZihgJHtyb290fS5zcGVjLnRzYCkpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoYCR7cm9vdH0udHNgKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgdGhlIHByZWZpeCcsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgcHJlZml4OiAncHJlJyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5jb21wb25lbnQudHMnKTtcbiAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvc2VsZWN0b3I6ICdwcmUtZm9vJy8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHVzZSB0aGUgZGVmYXVsdCBwcm9qZWN0IHByZWZpeCBpZiBub25lIGlzIHBhc3NlZCcsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgcHJlZml4OiB1bmRlZmluZWQgfTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudCgnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28uY29tcG9uZW50LnRzJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL3NlbGVjdG9yOiAnYXBwLWZvbycvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgdGhlIHN1cHBsaWVkIHByZWZpeCBpZiBpdCBpcyBcIlwiJywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBwcmVmaXg6ICcnIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC50cycpO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9zZWxlY3RvcjogJ2ZvbycvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXNwZWN0IHRoZSBpbmxpbmVUZW1wbGF0ZSBvcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIGlubGluZVRlbXBsYXRlOiB0cnVlIH07XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5jb21wb25lbnQudHMnKTtcbiAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvdGVtcGxhdGU6IC8pO1xuICAgIGV4cGVjdChjb250ZW50KS5ub3QudG9NYXRjaCgvdGVtcGxhdGVVcmw6IC8pO1xuICAgIGV4cGVjdCh0cmVlLmZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC5odG1sJykpLnRvRXF1YWwoLTEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc3BlY3QgdGhlIGlubGluZVN0eWxlIG9wdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgaW5saW5lU3R5bGU6IHRydWUgfTtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLmNvbXBvbmVudC50cycpO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9zdHlsZXM6IFxcWy8pO1xuICAgIGV4cGVjdChjb250ZW50KS5ub3QudG9NYXRjaCgvc3R5bGVVcmxzOiAvKTtcbiAgICBleHBlY3QodHJlZS5maWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5jb21wb25lbnQuY3NzJykpLnRvRXF1YWwoLTEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc3BlY3QgdGhlIHN0eWxlZXh0IG9wdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgc3R5bGVleHQ6ICdzY3NzJyB9O1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudCgnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28uY29tcG9uZW50LnRzJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL3N0eWxlVXJsczogXFxbJy5cXC9mb28uY29tcG9uZW50LnNjc3MvKTtcbiAgICBleHBlY3QodHJlZS5maWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5jb21wb25lbnQuc2NzcycpKVxuICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KHRyZWUuZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28uY29tcG9uZW50LmNzcycpKS50b0VxdWFsKC0xKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgdGhlIG1vZHVsZSBmbGFnIGV2ZW4gaWYgdGhlIG1vZHVsZSBpcyBhIHJvdXRpbmcgbW9kdWxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvdXRpbmdGaWxlTmFtZSA9ICdhcHAtcm91dGluZy5tb2R1bGUudHMnO1xuICAgIGNvbnN0IHJvdXRpbmdNb2R1bGVQYXRoID0gYC9wcm9qZWN0cy9iYXIvc3JjL2FwcC8ke3JvdXRpbmdGaWxlTmFtZX1gO1xuICAgIGNvbnN0IG5ld1RyZWUgPSBjcmVhdGVBcHBNb2R1bGUoYXBwVHJlZSwgcm91dGluZ01vZHVsZVBhdGgpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBtb2R1bGU6IHJvdXRpbmdGaWxlTmFtZSB9O1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdjb21wb25lbnQnLCBvcHRpb25zLCBuZXdUcmVlKTtcbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudChyb3V0aW5nTW9kdWxlUGF0aCk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2ltcG9ydCB7IEZvb0NvbXBvbmVudCB9IGZyb20gJy5cXC9mb29cXC9mb28uY29tcG9uZW50Lyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaGFuZGxlIGEgcGF0aCBpbiB0aGUgbmFtZSBvcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIG5hbWU6ICdkaXIvdGVzdC1jb21wb25lbnQnIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50Jywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAvaW1wb3J0IHsgVGVzdENvbXBvbmVudENvbXBvbmVudCB9IGZyb20gJ1xcLlxcL2RpclxcL3Rlc3QtY29tcG9uZW50XFwvdGVzdC1jb21wb25lbnQuY29tcG9uZW50Jy8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBhIHBhdGggaW4gdGhlIG5hbWUgYW5kIG1vZHVsZSBvcHRpb25zJywgKCkgPT4ge1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtb2R1bGUnLCB7IG5hbWU6ICdhZG1pbi9tb2R1bGUnLCBwcm9qZWN0OiAnYmFyJyB9LCBhcHBUcmVlKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBuYW1lOiAnb3RoZXIvdGVzdC1jb21wb25lbnQnLCBtb2R1bGU6ICdhZG1pbi9tb2R1bGUnIH07XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuXG4gICAgY29uc3QgY29udGVudCA9IGFwcFRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hZG1pbi9tb2R1bGUvbW9kdWxlLm1vZHVsZS50cycpO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKFxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgL2ltcG9ydCB7IFRlc3RDb21wb25lbnRDb21wb25lbnQgfSBmcm9tICcuLlxcLy4uXFwvb3RoZXJcXC90ZXN0LWNvbXBvbmVudFxcL3Rlc3QtY29tcG9uZW50LmNvbXBvbmVudCcvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgdGhlIHJpZ2h0IHNlbGVjdG9yIHdpdGggYSBwYXRoIGluIHRoZSBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBuYW1lOiAnc3ViL3Rlc3QnIH07XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2NvbXBvbmVudCcsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBhcHBUcmVlLnJlYWRDb250ZW50KCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvc3ViL3Rlc3QvdGVzdC5jb21wb25lbnQudHMnKTtcbiAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvc2VsZWN0b3I6ICdhcHAtdGVzdCcvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXNwZWN0IHRoZSBzb3VyY2VSb290IHZhbHVlJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoYXBwVHJlZS5yZWFkQ29udGVudCgnL2FuZ3VsYXIuanNvbicpKTtcbiAgICBjb25maWcucHJvamVjdHMuYmFyLnNvdXJjZVJvb3QgPSAncHJvamVjdHMvYmFyL2N1c3RvbSc7XG4gICAgYXBwVHJlZS5vdmVyd3JpdGUoJy9hbmd1bGFyLmpzb24nLCBKU09OLnN0cmluZ2lmeShjb25maWcsIG51bGwsIDIpKTtcblxuICAgIC8vIHNob3VsZCBmYWlsIHdpdGhvdXQgYSBtb2R1bGUgaW4gdGhhdCBkaXJcbiAgICBleHBlY3QoKCkgPT4gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50JywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpKS50b1Rocm93KCk7XG5cbiAgICAvLyBtb3ZlIHRoZSBtb2R1bGVcbiAgICBhcHBUcmVlLnJlbmFtZSgnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGUudHMnLCAnL3Byb2plY3RzL2Jhci9jdXN0b20vYXBwL2FwcC5tb2R1bGUudHMnKTtcbiAgICBhcHBUcmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnY29tcG9uZW50JywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGV4cGVjdChhcHBUcmVlLmZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvY3VzdG9tL2FwcC9mb28vZm9vLmNvbXBvbmVudC50cycpKVxuICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xufSk7XG4iXX0=