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
describe('Universal Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        clientProject: 'bar',
    };
    const workspaceUniversalOptions = {
        clientProject: 'workspace',
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
    const initialWorkspaceAppOptions = {
        name: 'workspace',
        projectRoot: '',
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
        appTree = schematicRunner.runSchematic('application', initialWorkspaceAppOptions, appTree);
        appTree = schematicRunner.runSchematic('application', appOptions, appTree);
    });
    it('should create a root module file', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.server.module.ts';
        expect(tree.exists(filePath)).toEqual(true);
    });
    it('should create a main file', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/projects/bar/src/main.server.ts';
        expect(tree.exists(filePath)).toEqual(true);
        const contents = tree.readContent(filePath);
        expect(contents).toMatch(/export { AppServerModule } from '\.\/app\/app\.server\.module'/);
    });
    it('should create a tsconfig file for the workspace project', () => {
        const tree = schematicRunner.runSchematic('universal', workspaceUniversalOptions, appTree);
        const filePath = '/src/tsconfig.server.json';
        expect(tree.exists(filePath)).toEqual(true);
        const contents = tree.readContent(filePath);
        expect(JSON.parse(contents)).toEqual({
            extends: './tsconfig.app.json',
            compilerOptions: {
                outDir: '../out-tsc/app-server',
                baseUrl: '.',
            },
            angularCompilerOptions: {
                entryModule: 'app/app.server.module#AppServerModule',
            },
        });
        const angularConfig = JSON.parse(tree.readContent('angular.json'));
        expect(angularConfig.projects.workspace.architect.server.options.tsConfig)
            .toEqual('src/tsconfig.server.json');
    });
    it('should create a tsconfig file for a generated application', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/projects/bar/tsconfig.server.json';
        expect(tree.exists(filePath)).toEqual(true);
        const contents = tree.readContent(filePath);
        expect(JSON.parse(contents)).toEqual({
            extends: './tsconfig.app.json',
            compilerOptions: {
                outDir: '../../out-tsc/app-server',
                baseUrl: '.',
            },
            angularCompilerOptions: {
                entryModule: 'src/app/app.server.module#AppServerModule',
            },
        });
        const angularConfig = JSON.parse(tree.readContent('angular.json'));
        expect(angularConfig.projects.bar.architect.server.options.tsConfig)
            .toEqual('projects/bar/tsconfig.server.json');
    });
    it('should add dependency: @angular/platform-server', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/package.json';
        const contents = tree.readContent(filePath);
        expect(contents).toMatch(/\"@angular\/platform-server\": \"/);
    });
    it('should update workspace with a server target', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/angular.json';
        const contents = tree.readContent(filePath);
        const config = JSON.parse(contents.toString());
        const arch = config.projects.bar.architect;
        expect(arch.server).toBeDefined();
        expect(arch.server.builder).toBeDefined();
        const opts = arch.server.options;
        expect(opts.outputPath).toEqual('dist/bar-server');
        expect(opts.main).toEqual('projects/bar/src/main.server.ts');
        expect(opts.tsConfig).toEqual('projects/bar/tsconfig.server.json');
    });
    it('should add a server transition to BrowerModule import', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.module.ts';
        const contents = tree.readContent(filePath);
        expect(contents).toMatch(/BrowserModule\.withServerTransition\({ appId: 'serverApp' }\)/);
    });
    it('should wrap the bootstrap call in a DOMContentLoaded event handler', () => {
        const tree = schematicRunner.runSchematic('universal', defaultOptions, appTree);
        const filePath = '/projects/bar/src/main.ts';
        const contents = tree.readContent(filePath);
        expect(contents).toMatch(/document.addEventListener\('DOMContentLoaded', \(\) => {/);
    });
    it('should install npm dependencies', () => {
        schematicRunner.runSchematic('universal', defaultOptions, appTree);
        expect(schematicRunner.tasks.length).toBe(1);
        expect(schematicRunner.tasks[0].name).toBe('node-package');
        expect(schematicRunner.tasks[0].options.command).toBe('install');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3VuaXZlcnNhbC9pbmRleF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0VBQXVGO0FBQ3ZGLDZCQUE2QjtBQUs3QixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE1BQU0sZUFBZSxHQUFHLElBQUksNkJBQW1CLENBQzdDLHFCQUFxQixFQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUMzQyxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQXFCO1FBQ3ZDLGFBQWEsRUFBRSxLQUFLO0tBQ3JCLENBQUM7SUFDRixNQUFNLHlCQUF5QixHQUFxQjtRQUNsRCxhQUFhLEVBQUUsV0FBVztLQUMzQixDQUFDO0lBRUYsTUFBTSxnQkFBZ0IsR0FBcUI7UUFDekMsSUFBSSxFQUFFLFdBQVc7UUFDakIsY0FBYyxFQUFFLFVBQVU7UUFDMUIsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUF1QjtRQUNyQyxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLE9BQU8sRUFBRSxLQUFLO1FBQ2QsS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixlQUFlLEVBQUUsS0FBSztLQUN2QixDQUFDO0lBRUYsTUFBTSwwQkFBMEIsR0FBdUI7UUFDckQsSUFBSSxFQUFFLFdBQVc7UUFDakIsV0FBVyxFQUFFLEVBQUU7UUFDZixXQUFXLEVBQUUsS0FBSztRQUNsQixjQUFjLEVBQUUsS0FBSztRQUNyQixPQUFPLEVBQUUsS0FBSztRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxF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QUFDLENBQUMsT0FBTyxDQUFDLCtEQUErRCxDQUFDLENBQUM7SUFDNUYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1FBQzVFLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRixNQUFNLFFBQVEsR0FBRywyQkFBMkIsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsMERBQTBELENBQUMsQ0FBQztJQUN2RixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDekMsZUFBZSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFNjaGVtYXRpY1Rlc3RSdW5uZXIsIFVuaXRUZXN0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rlc3RpbmcnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNjaGVtYSBhcyBBcHBsaWNhdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hcHBsaWNhdGlvbi9zY2hlbWEnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIFdvcmtzcGFjZU9wdGlvbnMgfSBmcm9tICcuLi93b3Jrc3BhY2Uvc2NoZW1hJztcbmltcG9ydCB7IFNjaGVtYSBhcyBVbml2ZXJzYWxPcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5kZXNjcmliZSgnVW5pdmVyc2FsIFNjaGVtYXRpYycsICgpID0+IHtcbiAgY29uc3Qgc2NoZW1hdGljUnVubmVyID0gbmV3IFNjaGVtYXRpY1Rlc3RSdW5uZXIoXG4gICAgJ0BzY2hlbWF0aWNzL2FuZ3VsYXInLFxuICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9jb2xsZWN0aW9uLmpzb24nKSxcbiAgKTtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMgPSB7XG4gICAgY2xpZW50UHJvamVjdDogJ2JhcicsXG4gIH07XG4gIGNvbnN0IHdvcmtzcGFjZVVuaXZlcnNhbE9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMgPSB7XG4gICAgY2xpZW50UHJvamVjdDogJ3dvcmtzcGFjZScsXG4gIH07XG5cbiAgY29uc3Qgd29ya3NwYWNlT3B0aW9uczogV29ya3NwYWNlT3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnd29ya3NwYWNlJyxcbiAgICBuZXdQcm9qZWN0Um9vdDogJ3Byb2plY3RzJyxcbiAgICB2ZXJzaW9uOiAnNi4wLjAnLFxuICB9O1xuXG4gIGNvbnN0IGFwcE9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnYmFyJyxcbiAgICBpbmxpbmVTdHlsZTogZmFsc2UsXG4gICAgaW5saW5lVGVtcGxhdGU6IGZhbHNlLFxuICAgIHJvdXRpbmc6IGZhbHNlLFxuICAgIHN0eWxlOiAnY3NzJyxcbiAgICBza2lwVGVzdHM6IGZhbHNlLFxuICAgIHNraXBQYWNrYWdlSnNvbjogZmFsc2UsXG4gIH07XG5cbiAgY29uc3QgaW5pdGlhbFdvcmtzcGFjZUFwcE9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IHtcbiAgICBuYW1lOiAnd29ya3NwYWNlJyxcbiAgICBwcm9qZWN0Um9vdDogJycsXG4gICAgaW5saW5lU3R5bGU6IGZhbHNlLFxuICAgIGlubGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICByb3V0aW5nOiBmYWxzZSxcbiAgICBzdHlsZTogJ2NzcycsXG4gICAgc2tpcFRlc3RzOiBmYWxzZSxcbiAgICBza2lwUGFja2FnZUpzb246IGZhbHNlLFxuICB9O1xuXG4gIGxldCBhcHBUcmVlOiBVbml0VGVzdFRyZWU7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3dvcmtzcGFjZScsIHdvcmtzcGFjZU9wdGlvbnMpO1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBsaWNhdGlvbicsIGluaXRpYWxXb3Jrc3BhY2VBcHBPcHRpb25zLCBhcHBUcmVlKTtcbiAgICBhcHBUcmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnYXBwbGljYXRpb24nLCBhcHBPcHRpb25zLCBhcHBUcmVlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgYSByb290IG1vZHVsZSBmaWxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd1bml2ZXJzYWwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZVBhdGggPSAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5zZXJ2ZXIubW9kdWxlLnRzJztcbiAgICBleHBlY3QodHJlZS5leGlzdHMoZmlsZVBhdGgpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG1haW4gZmlsZScsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygndW5pdmVyc2FsJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gJy9wcm9qZWN0cy9iYXIvc3JjL21haW4uc2VydmVyLnRzJztcbiAgICBleHBlY3QodHJlZS5leGlzdHMoZmlsZVBhdGgpKS50b0VxdWFsKHRydWUpO1xuICAgIGNvbnN0IGNvbnRlbnRzID0gdHJlZS5yZWFkQ29udGVudChmaWxlUGF0aCk7XG4gICAgZXhwZWN0KGNvbnRlbnRzKS50b01hdGNoKC9leHBvcnQgeyBBcHBTZXJ2ZXJNb2R1bGUgfSBmcm9tICdcXC5cXC9hcHBcXC9hcHBcXC5zZXJ2ZXJcXC5tb2R1bGUnLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIGEgdHNjb25maWcgZmlsZSBmb3IgdGhlIHdvcmtzcGFjZSBwcm9qZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd1bml2ZXJzYWwnLCB3b3Jrc3BhY2VVbml2ZXJzYWxPcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9ICcvc3JjL3RzY29uZmlnLnNlcnZlci5qc29uJztcbiAgICBleHBlY3QodHJlZS5leGlzdHMoZmlsZVBhdGgpKS50b0VxdWFsKHRydWUpO1xuICAgIGNvbnN0IGNvbnRlbnRzID0gdHJlZS5yZWFkQ29udGVudChmaWxlUGF0aCk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UoY29udGVudHMpKS50b0VxdWFsKHtcbiAgICAgIGV4dGVuZHM6ICcuL3RzY29uZmlnLmFwcC5qc29uJyxcbiAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICBvdXREaXI6ICcuLi9vdXQtdHNjL2FwcC1zZXJ2ZXInLFxuICAgICAgICBiYXNlVXJsOiAnLicsXG4gICAgICB9LFxuICAgICAgYW5ndWxhckNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICBlbnRyeU1vZHVsZTogJ2FwcC9hcHAuc2VydmVyLm1vZHVsZSNBcHBTZXJ2ZXJNb2R1bGUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBhbmd1bGFyQ29uZmlnID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KCdhbmd1bGFyLmpzb24nKSk7XG4gICAgZXhwZWN0KGFuZ3VsYXJDb25maWcucHJvamVjdHMud29ya3NwYWNlLmFyY2hpdGVjdC5zZXJ2ZXIub3B0aW9ucy50c0NvbmZpZylcbiAgICAgIC50b0VxdWFsKCdzcmMvdHNjb25maWcuc2VydmVyLmpzb24nKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgYSB0c2NvbmZpZyBmaWxlIGZvciBhIGdlbmVyYXRlZCBhcHBsaWNhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygndW5pdmVyc2FsJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gJy9wcm9qZWN0cy9iYXIvdHNjb25maWcuc2VydmVyLmpzb24nO1xuICAgIGV4cGVjdCh0cmVlLmV4aXN0cyhmaWxlUGF0aCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgY29uc3QgY29udGVudHMgPSB0cmVlLnJlYWRDb250ZW50KGZpbGVQYXRoKTtcbiAgICBleHBlY3QoSlNPTi5wYXJzZShjb250ZW50cykpLnRvRXF1YWwoe1xuICAgICAgZXh0ZW5kczogJy4vdHNjb25maWcuYXBwLmpzb24nLFxuICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgIG91dERpcjogJy4uLy4uL291dC10c2MvYXBwLXNlcnZlcicsXG4gICAgICAgIGJhc2VVcmw6ICcuJyxcbiAgICAgIH0sXG4gICAgICBhbmd1bGFyQ29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgIGVudHJ5TW9kdWxlOiAnc3JjL2FwcC9hcHAuc2VydmVyLm1vZHVsZSNBcHBTZXJ2ZXJNb2R1bGUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBhbmd1bGFyQ29uZmlnID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KCdhbmd1bGFyLmpzb24nKSk7XG4gICAgZXhwZWN0KGFuZ3VsYXJDb25maWcucHJvamVjdHMuYmFyLmFyY2hpdGVjdC5zZXJ2ZXIub3B0aW9ucy50c0NvbmZpZylcbiAgICAgIC50b0VxdWFsKCdwcm9qZWN0cy9iYXIvdHNjb25maWcuc2VydmVyLmpzb24nKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgZGVwZW5kZW5jeTogQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd1bml2ZXJzYWwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZVBhdGggPSAnL3BhY2thZ2UuanNvbic7XG4gICAgY29uc3QgY29udGVudHMgPSB0cmVlLnJlYWRDb250ZW50KGZpbGVQYXRoKTtcbiAgICBleHBlY3QoY29udGVudHMpLnRvTWF0Y2goL1xcXCJAYW5ndWxhclxcL3BsYXRmb3JtLXNlcnZlclxcXCI6IFxcXCIvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1cGRhdGUgd29ya3NwYWNlIHdpdGggYSBzZXJ2ZXIgdGFyZ2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd1bml2ZXJzYWwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZVBhdGggPSAnL2FuZ3VsYXIuanNvbic7XG4gICAgY29uc3QgY29udGVudHMgPSB0cmVlLnJlYWRDb250ZW50KGZpbGVQYXRoKTtcbiAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKGNvbnRlbnRzLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IGFyY2ggPSBjb25maWcucHJvamVjdHMuYmFyLmFyY2hpdGVjdDtcbiAgICBleHBlY3QoYXJjaC5zZXJ2ZXIpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KGFyY2guc2VydmVyLmJ1aWxkZXIpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3Qgb3B0cyA9IGFyY2guc2VydmVyLm9wdGlvbnM7XG4gICAgZXhwZWN0KG9wdHMub3V0cHV0UGF0aCkudG9FcXVhbCgnZGlzdC9iYXItc2VydmVyJyk7XG4gICAgZXhwZWN0KG9wdHMubWFpbikudG9FcXVhbCgncHJvamVjdHMvYmFyL3NyYy9tYWluLnNlcnZlci50cycpO1xuICAgIGV4cGVjdChvcHRzLnRzQ29uZmlnKS50b0VxdWFsKCdwcm9qZWN0cy9iYXIvdHNjb25maWcuc2VydmVyLmpzb24nKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgYSBzZXJ2ZXIgdHJhbnNpdGlvbiB0byBCcm93ZXJNb2R1bGUgaW1wb3J0JywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCd1bml2ZXJzYWwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZVBhdGggPSAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGUudHMnO1xuICAgIGNvbnN0IGNvbnRlbnRzID0gdHJlZS5yZWFkQ29udGVudChmaWxlUGF0aCk7XG4gICAgZXhwZWN0KGNvbnRlbnRzKS50b01hdGNoKC9Ccm93c2VyTW9kdWxlXFwud2l0aFNlcnZlclRyYW5zaXRpb25cXCh7IGFwcElkOiAnc2VydmVyQXBwJyB9XFwpLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd3JhcCB0aGUgYm9vdHN0cmFwIGNhbGwgaW4gYSBET01Db250ZW50TG9hZGVkIGV2ZW50IGhhbmRsZXInLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3VuaXZlcnNhbCcsIGRlZmF1bHRPcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9ICcvcHJvamVjdHMvYmFyL3NyYy9tYWluLnRzJztcbiAgICBjb25zdCBjb250ZW50cyA9IHRyZWUucmVhZENvbnRlbnQoZmlsZVBhdGgpO1xuICAgIGV4cGVjdChjb250ZW50cykudG9NYXRjaCgvZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lclxcKCdET01Db250ZW50TG9hZGVkJywgXFwoXFwpID0+IHsvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBpbnN0YWxsIG5wbSBkZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygndW5pdmVyc2FsJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGV4cGVjdChzY2hlbWF0aWNSdW5uZXIudGFza3MubGVuZ3RoKS50b0JlKDEpO1xuICAgIGV4cGVjdChzY2hlbWF0aWNSdW5uZXIudGFza3NbMF0ubmFtZSkudG9CZSgnbm9kZS1wYWNrYWdlJyk7XG4gICAgZXhwZWN0KChzY2hlbWF0aWNSdW5uZXIudGFza3NbMF0ub3B0aW9ucyBhcyB7Y29tbWFuZDogc3RyaW5nfSkuY29tbWFuZCkudG9CZSgnaW5zdGFsbCcpO1xuICB9KTtcbn0pO1xuIl19