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
describe('Module Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        spec: true,
        module: undefined,
        flat: false,
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
    it('should create a module', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('module', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo/foo.module.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo.module.ts')).toBeGreaterThanOrEqual(0);
    });
    it('should import into another module', () => {
        const options = Object.assign({}, defaultOptions, { module: 'app.module.ts' });
        const tree = schematicRunner.runSchematic('module', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(content).toMatch(/import { FooModule } from '.\/foo\/foo.module'/);
        expect(content).toMatch(/imports: \[[^\]]*FooModule[^\]]*\]/m);
    });
    it('should import into another module (deep)', () => {
        let tree = appTree;
        tree = schematicRunner.runSchematic('module', Object.assign({}, defaultOptions, { path: 'projects/bar/src/app/sub1', name: 'test1' }), tree);
        tree = schematicRunner.runSchematic('module', Object.assign({}, defaultOptions, { path: 'projects/bar/src/app/sub2', name: 'test2', module: '../sub1/test1' }), tree);
        const content = tree.readContent('/projects/bar/src/app/sub1/test1/test1.module.ts');
        expect(content).toMatch(/import { Test2Module } from '..\/..\/sub2\/test2\/test2.module'/);
    });
    it('should create a routing module', () => {
        const options = Object.assign({}, defaultOptions, { routing: true });
        const tree = schematicRunner.runSchematic('module', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo/foo.module.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo-routing.module.ts')).toBeGreaterThanOrEqual(0);
        const moduleContent = tree.readContent('/projects/bar/src/app/foo/foo.module.ts');
        expect(moduleContent).toMatch(/import { FooRoutingModule } from '.\/foo-routing.module'/);
        const routingModuleContent = tree.readContent('/projects/bar/src/app/foo/foo-routing.module.ts');
        expect(routingModuleContent).toMatch(/RouterModule.forChild\(routes\)/);
    });
    it('should respect the spec flag', () => {
        const options = Object.assign({}, defaultOptions, { spec: false });
        const tree = schematicRunner.runSchematic('module', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/foo/foo.module.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/foo/foo.module.spec.ts')).toEqual(-1);
    });
    it('should dasherize a name', () => {
        const options = Object.assign({}, defaultOptions, { name: 'TwoWord' });
        const tree = schematicRunner.runSchematic('module', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/projects/bar/src/app/two-word/two-word.module.ts'))
            .toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/projects/bar/src/app/two-word/two-word.module.spec.ts'))
            .toBeGreaterThanOrEqual(0);
    });
    it('should respect the sourceRoot value', () => {
        const config = JSON.parse(appTree.readContent('/angular.json'));
        config.projects.bar.sourceRoot = 'projects/bar/custom';
        appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));
        appTree = schematicRunner.runSchematic('module', defaultOptions, appTree);
        expect(appTree.files.indexOf('/projects/bar/custom/app/foo/foo.module.ts'))
            .toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL21vZHVsZS9pbmRleF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0VBQXVGO0FBQ3ZGLDZCQUE2QjtBQUs3QixpQ0FBaUM7QUFDakMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxNQUFNLGVBQWUsR0FBRyxJQUFJLDZCQUFtQixDQUM3QyxxQkFBcUIsRUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FDM0MsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFrQjtRQUNwQyxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxJQUFJO1FBQ1YsTUFBTSxFQUFFLFNBQVM7UUFDakIsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsS0FBSztLQUNmLENBQUM7SUFFRixNQUFNLGdCQUFnQixHQUFxQjtRQUN6QyxJQUFJLEVBQUUsV0FBVztRQUNqQixjQUFjLEVBQUUsVUFBVTtRQUMxQixPQUFPLEVBQUUsT0FBTztLQUNqQixDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQXVCO1FBQ3JDLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLEtBQUs7UUFDbEIsY0FBYyxFQUFFLEtBQUs7UUFDckIsT0FBTyxFQUFFLEtBQUs7UUFDZCxLQUFLLEVBQUUsS0FBSztRQUNaLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCLENBQUM7SUFDRixJQUFJLE9BQXFCLENBQUM7SUFDMUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLE9BQU8sR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sR0FB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QUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztRQUN2RCxPQUFPLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2FBQ3hFLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBTY2hlbWF0aWNUZXN0UnVubmVyLCBVbml0VGVzdFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgQXBwbGljYXRpb25PcHRpb25zIH0gZnJvbSAnLi4vYXBwbGljYXRpb24vc2NoZW1hJztcbmltcG9ydCB7IFNjaGVtYSBhcyBXb3Jrc3BhY2VPcHRpb25zIH0gZnJvbSAnLi4vd29ya3NwYWNlL3NjaGVtYSc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgTW9kdWxlT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG5kZXNjcmliZSgnTW9kdWxlIFNjaGVtYXRpYycsICgpID0+IHtcbiAgY29uc3Qgc2NoZW1hdGljUnVubmVyID0gbmV3IFNjaGVtYXRpY1Rlc3RSdW5uZXIoXG4gICAgJ0BzY2hlbWF0aWNzL2FuZ3VsYXInLFxuICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9jb2xsZWN0aW9uLmpzb24nKSxcbiAgKTtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IE1vZHVsZU9wdGlvbnMgPSB7XG4gICAgbmFtZTogJ2ZvbycsXG4gICAgc3BlYzogdHJ1ZSxcbiAgICBtb2R1bGU6IHVuZGVmaW5lZCxcbiAgICBmbGF0OiBmYWxzZSxcbiAgICBwcm9qZWN0OiAnYmFyJyxcbiAgfTtcblxuICBjb25zdCB3b3Jrc3BhY2VPcHRpb25zOiBXb3Jrc3BhY2VPcHRpb25zID0ge1xuICAgIG5hbWU6ICd3b3Jrc3BhY2UnLFxuICAgIG5ld1Byb2plY3RSb290OiAncHJvamVjdHMnLFxuICAgIHZlcnNpb246ICc2LjAuMCcsXG4gIH07XG5cbiAgY29uc3QgYXBwT3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0ge1xuICAgIG5hbWU6ICdiYXInLFxuICAgIGlubGluZVN0eWxlOiBmYWxzZSxcbiAgICBpbmxpbmVUZW1wbGF0ZTogZmFsc2UsXG4gICAgcm91dGluZzogZmFsc2UsXG4gICAgc3R5bGU6ICdjc3MnLFxuICAgIHNraXBUZXN0czogZmFsc2UsXG4gICAgc2tpcFBhY2thZ2VKc29uOiBmYWxzZSxcbiAgfTtcbiAgbGV0IGFwcFRyZWU6IFVuaXRUZXN0VHJlZTtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3dvcmtzcGFjZScsIHdvcmtzcGFjZU9wdGlvbnMpO1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBsaWNhdGlvbicsIGFwcE9wdGlvbnMsIGFwcFRyZWUpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG1vZHVsZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21vZHVsZScsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVzID0gdHJlZS5maWxlcztcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28ubW9kdWxlLnNwZWMudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28ubW9kdWxlLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaW1wb3J0IGludG8gYW5vdGhlciBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIG1vZHVsZTogJ2FwcC5tb2R1bGUudHMnIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbW9kdWxlJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2ltcG9ydCB7IEZvb01vZHVsZSB9IGZyb20gJy5cXC9mb29cXC9mb28ubW9kdWxlJy8pO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9pbXBvcnRzOiBcXFtbXlxcXV0qRm9vTW9kdWxlW15cXF1dKlxcXS9tKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBpbXBvcnQgaW50byBhbm90aGVyIG1vZHVsZSAoZGVlcCknLCAoKSA9PiB7XG4gICAgbGV0IHRyZWUgPSBhcHBUcmVlO1xuXG4gICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21vZHVsZScsIHtcbiAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgcGF0aDogJ3Byb2plY3RzL2Jhci9zcmMvYXBwL3N1YjEnLFxuICAgICAgbmFtZTogJ3Rlc3QxJyxcbiAgICB9LCB0cmVlKTtcbiAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbW9kdWxlJywge1xuICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICBwYXRoOiAncHJvamVjdHMvYmFyL3NyYy9hcHAvc3ViMicsXG4gICAgICBuYW1lOiAndGVzdDInLFxuICAgICAgbW9kdWxlOiAnLi4vc3ViMS90ZXN0MScsXG4gICAgfSwgdHJlZSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudCgnL3Byb2plY3RzL2Jhci9zcmMvYXBwL3N1YjEvdGVzdDEvdGVzdDEubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2ltcG9ydCB7IFRlc3QyTW9kdWxlIH0gZnJvbSAnLi5cXC8uLlxcL3N1YjJcXC90ZXN0MlxcL3Rlc3QyLm1vZHVsZScvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgYSByb3V0aW5nIG1vZHVsZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgcm91dGluZzogdHJ1ZSB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21vZHVsZScsIG9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVzID0gdHJlZS5maWxlcztcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28ubW9kdWxlLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLXJvdXRpbmcubW9kdWxlLnRzJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgY29uc3QgbW9kdWxlQ29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLm1vZHVsZS50cycpO1xuICAgIGV4cGVjdChtb2R1bGVDb250ZW50KS50b01hdGNoKC9pbXBvcnQgeyBGb29Sb3V0aW5nTW9kdWxlIH0gZnJvbSAnLlxcL2Zvby1yb3V0aW5nLm1vZHVsZScvKTtcbiAgICBjb25zdCByb3V0aW5nTW9kdWxlQ29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9mb28vZm9vLXJvdXRpbmcubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KHJvdXRpbmdNb2R1bGVDb250ZW50KS50b01hdGNoKC9Sb3V0ZXJNb2R1bGUuZm9yQ2hpbGRcXChyb3V0ZXNcXCkvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXNwZWN0IHRoZSBzcGVjIGZsYWcnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIHNwZWM6IGZhbHNlIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbW9kdWxlJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZXMgPSB0cmVlLmZpbGVzO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvZm9vL2Zvby5tb2R1bGUudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL2Zvby9mb28ubW9kdWxlLnNwZWMudHMnKSkudG9FcXVhbCgtMSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZGFzaGVyaXplIGEgbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucywgbmFtZTogJ1R3b1dvcmQnIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbW9kdWxlJywgb3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZXMgPSB0cmVlLmZpbGVzO1xuICAgIGV4cGVjdChmaWxlcy5pbmRleE9mKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvdHdvLXdvcmQvdHdvLXdvcmQubW9kdWxlLnRzJykpXG4gICAgICAudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL3Byb2plY3RzL2Jhci9zcmMvYXBwL3R3by13b3JkL3R3by13b3JkLm1vZHVsZS5zcGVjLnRzJykpXG4gICAgICAudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXNwZWN0IHRoZSBzb3VyY2VSb290IHZhbHVlJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoYXBwVHJlZS5yZWFkQ29udGVudCgnL2FuZ3VsYXIuanNvbicpKTtcbiAgICBjb25maWcucHJvamVjdHMuYmFyLnNvdXJjZVJvb3QgPSAncHJvamVjdHMvYmFyL2N1c3RvbSc7XG4gICAgYXBwVHJlZS5vdmVyd3JpdGUoJy9hbmd1bGFyLmpzb24nLCBKU09OLnN0cmluZ2lmeShjb25maWcsIG51bGwsIDIpKTtcbiAgICBhcHBUcmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbW9kdWxlJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGV4cGVjdChhcHBUcmVlLmZpbGVzLmluZGV4T2YoJy9wcm9qZWN0cy9iYXIvY3VzdG9tL2FwcC9mb28vZm9vLm1vZHVsZS50cycpKVxuICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gIH0pO1xufSk7XG4iXX0=