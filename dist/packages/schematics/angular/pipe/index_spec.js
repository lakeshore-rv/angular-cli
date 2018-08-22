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
const test_1 = require("../utility/test");
describe('Pipe Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        spec: true,
        module: undefined,
        export: false,
        flat: true,
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
    it('should create a pipe', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('pipe', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo.pipe.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo.pipe.ts')).toBeGreaterThanOrEqual(0);
        const moduleContent = test_1.getFileContent(tree, '/projects/bar/src/app/app.module.ts');
        expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo.pipe'/);
        expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooPipe\r?\n/m);
    });
    it('should import into a specified module', () => {
        const options = Object.assign({}, defaultOptions, { module: 'app.module.ts' });
        const tree = schematicRunner.runSchematic('pipe', options, appTree);
        const appModule = test_1.getFileContent(tree, '/projects/bar/src/app/app.module.ts');
        expect(appModule).toMatch(/import { FooPipe } from '.\/foo.pipe'/);
    });
    it('should fail if specified module does not exist', () => {
        const options = Object.assign({}, defaultOptions, { module: '/projects/bar/src/app/app.moduleXXX.ts' });
        let thrownError = null;
        try {
            schematicRunner.runSchematic('pipe', options, appTree);
        }
        catch (err) {
            thrownError = err;
        }
        expect(thrownError).toBeDefined();
    });
    it('should export the pipe', () => {
        const options = Object.assign({}, defaultOptions, { export: true });
        const tree = schematicRunner.runSchematic('pipe', options, appTree);
        const appModuleContent = test_1.getFileContent(tree, '/projects/bar/src/app/app.module.ts');
        expect(appModuleContent).toMatch(/exports: \[FooPipe\]/);
    });
    it('should respect the flat flag', () => {
        const options = Object.assign({}, defaultOptions, { flat: false });
        const tree = schematicRunner.runSchematic('pipe', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo/foo.pipe.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo.pipe.ts')).toBeGreaterThanOrEqual(0);
        const moduleContent = test_1.getFileContent(tree, '/projects/bar/src/app/app.module.ts');
        expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.pipe'/);
        expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooPipe\r?\n/m);
    });
    it('should use the module flag even if the module is a routing module', () => {
        const routingFileName = 'app-routing.module.ts';
        const routingModulePath = `/projects/bar/src/app/${routingFileName}`;
        const newTree = test_1.createAppModule(appTree, routingModulePath);
        const options = Object.assign({}, defaultOptions, { module: routingFileName });
        const tree = schematicRunner.runSchematic('pipe', options, newTree);
        const content = test_1.getFileContent(tree, routingModulePath);
        expect(content).toMatch(/import { FooPipe } from '.\/foo.pipe/);
    });
    it('should respect the sourceRoot value', () => {
        const config = JSON.parse(appTree.readContent('/angular.json'));
        config.projects.bar.sourceRoot = 'projects/bar/custom';
        appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));
        // should fail without a module in that dir
        expect(() => schematicRunner.runSchematic('pipe', defaultOptions, appTree)).toThrow();
        // move the module
        appTree.rename('/projects/bar/src/app/app.module.ts', '/projects/bar/custom/app/app.module.ts');
        appTree = schematicRunner.runSchematic('pipe', defaultOptions, appTree);
        expect(appTree.files.indexOf('/projects/bar/custom/app/foo.pipe.ts'))
            .toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3BpcGUvaW5kZXhfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGdFQUF1RjtBQUN2Riw2QkFBNkI7QUFFN0IsMENBQWtFO0FBS2xFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsTUFBTSxlQUFlLEdBQUcsSUFBSSw2QkFBbUIsQ0FDN0MscUJBQXFCLEVBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQzNDLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBZ0I7UUFDbEMsSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsSUFBSTtRQUNWLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsS0FBSztLQUNmLENBQUM7SUFFRixNQUFNLGdCQUFnQixHQUFxQjtRQUN6QyxJQUFJLEVBQUUsV0FBVztRQUNqQixjQUFjLEVBQUUsVUFBVTtRQUMxQixPQUFPLEVBQUUsT0FBTztLQUNqQixDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQXVCO1FBQ3JDLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLEtBQUs7UUFDbEIsY0FBYyxFQUFFLEtBQUs7UUFDckIsT0FBTyxFQUFFLEtBQUs7UUFDZCxLQUFLLEVBQUUsS0FBSztRQUNaLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCLENBQUM7SUFDRixJQUFJLE9BQXFCLENBQUM7SUFDMUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLE9BQU8sR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxD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Q0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUM7UUFDdkQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEUsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV0RixrQkFBa0I7UUFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQ0FBcUMsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ2hHLE9BQU8sR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7YUFDbEUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFNjaGVtYXRpY1Rlc3RSdW5uZXIsIFVuaXRUZXN0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rlc3RpbmcnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNjaGVtYSBhcyBBcHBsaWNhdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hcHBsaWNhdGlvbi9zY2hlbWEnO1xuaW1wb3J0IHsgY3JlYXRlQXBwTW9kdWxlLCBnZXRGaWxlQ29udGVudCB9IGZyb20gJy4uL3V0aWxpdHkvdGVzdCc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgV29ya3NwYWNlT3B0aW9ucyB9IGZyb20gJy4uL3dvcmtzcGFjZS9zY2hlbWEnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIFBpcGVPcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5cbmRlc2NyaWJlKCdQaXBlIFNjaGVtYXRpYycsICgpID0+IHtcbiAgY29uc3Qgc2NoZW1hdGljUnVubmVyID0gbmV3IFNjaGVtYXRpY1Rlc3RSdW5uZXIoXG4gICAgJ0BzY2hlbWF0aWNzL2FuZ3VsYXInLFxuICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9jb2xsZWN0aW9uLmpzb24nKSxcbiAgKTtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFBpcGVPcHRpb25zID0ge1xuICAgIG5hbWU6ICdmb28nLFxuICAgIHNwZWM6IHRydWUsXG4gICAgbW9kdWxlOiB1bmRlZmluZWQsXG4gICAgZXhwb3J0OiBmYWxzZSxcbiAgICBmbGF0OiB0cnVlLFxuICAgIHByb2plY3Q6ICdiYXInLFxuICB9O1xuXG4gIGNvbnN0IHdvcmtzcGFjZU9wdGlvbnM6IFdvcmtzcGFjZU9wdGlvbnMgPSB7XG4gICAgbmFtZTogJ3dvcmtzcGFjZScsXG4gICAgbmV3UHJvamVjdFJvb3Q6ICdwcm9qZWN0cycsXG4gICAgdmVyc2lvbjogJzYuMC4wJyxcbiAgfTtcblxuICBjb25zdCBhcHBPcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7XG4gICAgbmFtZTogJ2JhcicsXG4gICAgaW5saW5lU3R5bGU6IGZhbHNlLFxuICAgIGlubGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICByb3V0aW5nOiBmYWxzZSxcbiAgICBzdHlsZTogJ2NzcycsXG4gICAgc2tpcFRlc3RzOiBmYWxzZSxcbiAgICBza2lwUGFja2FnZUpzb246IGZhbHNlLFxuICB9O1xuICBsZXQgYXBwVHJlZTogVW5pdFRlc3RUcmVlO1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHBUcmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnd29ya3NwYWNlJywgd29ya3NwYWNlT3B0aW9ucyk7XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2FwcGxpY2F0aW9uJywgYXBwT3B0aW9ucywgYXBwVHJlZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIGEgcGlwZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3BpcGUnLCBvcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmaWxlcyA9IHRyZWUuZmlsZXM7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28ucGlwZS5zcGVjLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28ucGlwZS50cycpKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGNvbnN0IG1vZHVsZUNvbnRlbnQgPSBnZXRGaWxlQ29udGVudCh0cmVlLCAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGUudHMnKTtcbiAgICBleHBlY3QobW9kdWxlQ29udGVudCkudG9NYXRjaCgvaW1wb3J0LipGb28uKmZyb20gJy5cXC9mb28ucGlwZScvKTtcbiAgICBleHBlY3QobW9kdWxlQ29udGVudCkudG9NYXRjaCgvZGVjbGFyYXRpb25zOlxccypcXFtbXlxcXV0rPyxcXHI/XFxuXFxzK0Zvb1BpcGVcXHI/XFxuL20pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGltcG9ydCBpbnRvIGEgc3BlY2lmaWVkIG1vZHVsZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgbW9kdWxlOiAnYXBwLm1vZHVsZS50cycgfTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdwaXBlJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgYXBwTW9kdWxlID0gZ2V0RmlsZUNvbnRlbnQodHJlZSwgJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAubW9kdWxlLnRzJyk7XG5cbiAgICBleHBlY3QoYXBwTW9kdWxlKS50b01hdGNoKC9pbXBvcnQgeyBGb29QaXBlIH0gZnJvbSAnLlxcL2Zvby5waXBlJy8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGZhaWwgaWYgc3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgbW9kdWxlOiAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGVYWFgudHMnIH07XG4gICAgbGV0IHRocm93bkVycm9yOiBFcnJvciB8IG51bGwgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdwaXBlJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvd25FcnJvciA9IGVycjtcbiAgICB9XG4gICAgZXhwZWN0KHRocm93bkVycm9yKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGV4cG9ydCB0aGUgcGlwZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgZXhwb3J0OiB0cnVlIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygncGlwZScsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGFwcE1vZHVsZUNvbnRlbnQgPSBnZXRGaWxlQ29udGVudCh0cmVlLCAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGUudHMnKTtcbiAgICBleHBlY3QoYXBwTW9kdWxlQ29udGVudCkudG9NYXRjaCgvZXhwb3J0czogXFxbRm9vUGlwZVxcXS8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc3BlY3QgdGhlIGZsYXQgZmxhZycsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgZmxhdDogZmFsc2UgfTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdwaXBlJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZXMgPSB0cmVlLmZpbGVzO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5waXBlLnNwZWMudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28ucGlwZS50cycpKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDApO1xuICAgIGNvbnN0IG1vZHVsZUNvbnRlbnQgPSBnZXRGaWxlQ29udGVudCh0cmVlLCAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGUudHMnKTtcbiAgICBleHBlY3QobW9kdWxlQ29udGVudCkudG9NYXRjaCgvaW1wb3J0LipGb28uKmZyb20gJy5cXC9mb29cXC9mb28ucGlwZScvKTtcbiAgICBleHBlY3QobW9kdWxlQ29udGVudCkudG9NYXRjaCgvZGVjbGFyYXRpb25zOlxccypcXFtbXlxcXV0rPyxcXHI/XFxuXFxzK0Zvb1BpcGVcXHI/XFxuL20pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHVzZSB0aGUgbW9kdWxlIGZsYWcgZXZlbiBpZiB0aGUgbW9kdWxlIGlzIGEgcm91dGluZyBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm91dGluZ0ZpbGVOYW1lID0gJ2FwcC1yb3V0aW5nLm1vZHVsZS50cyc7XG4gICAgY29uc3Qgcm91dGluZ01vZHVsZVBhdGggPSBgL3Byb2plY3RzL2Jhci9zcmMvYXBwLyR7cm91dGluZ0ZpbGVOYW1lfWA7XG4gICAgY29uc3QgbmV3VHJlZSA9IGNyZWF0ZUFwcE1vZHVsZShhcHBUcmVlLCByb3V0aW5nTW9kdWxlUGF0aCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIG1vZHVsZTogcm91dGluZ0ZpbGVOYW1lIH07XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3BpcGUnLCBvcHRpb25zLCBuZXdUcmVlKTtcbiAgICBjb25zdCBjb250ZW50ID0gZ2V0RmlsZUNvbnRlbnQodHJlZSwgcm91dGluZ01vZHVsZVBhdGgpO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9pbXBvcnQgeyBGb29QaXBlIH0gZnJvbSAnLlxcL2Zvby5waXBlLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmVzcGVjdCB0aGUgc291cmNlUm9vdCB2YWx1ZScsICgpID0+IHtcbiAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKGFwcFRyZWUucmVhZENvbnRlbnQoJy9hbmd1bGFyLmpzb24nKSk7XG4gICAgY29uZmlnLnByb2plY3RzLmJhci5zb3VyY2VSb290ID0gJ3Byb2plY3RzL2Jhci9jdXN0b20nO1xuICAgIGFwcFRyZWUub3ZlcndyaXRlKCcvYW5ndWxhci5qc29uJywgSlNPTi5zdHJpbmdpZnkoY29uZmlnLCBudWxsLCAyKSk7XG5cbiAgICAvLyBzaG91bGQgZmFpbCB3aXRob3V0IGEgbW9kdWxlIGluIHRoYXQgZGlyXG4gICAgZXhwZWN0KCgpID0+IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3BpcGUnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSkpLnRvVGhyb3coKTtcblxuICAgIC8vIG1vdmUgdGhlIG1vZHVsZVxuICAgIGFwcFRyZWUucmVuYW1lKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLm1vZHVsZS50cycsICcvcHJvamVjdHMvYmFyL2N1c3RvbS9hcHAvYXBwLm1vZHVsZS50cycpO1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdwaXBlJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGV4cGVjdChhcHBUcmVlLmZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvY3VzdG9tL2FwcC9mb28ucGlwZS50cycpKVxuICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xufSk7XG4iXX0=