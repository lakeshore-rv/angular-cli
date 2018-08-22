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
describe('App Shell Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        clientProject: 'bar',
        universalProject: 'universal',
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
        routing: true,
        style: 'css',
        skipTests: false,
        skipPackageJson: false,
    };
    let appTree;
    beforeEach(() => {
        appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
        appTree = schematicRunner.runSchematic('application', appOptions, appTree);
    });
    it('should ensure the client app has a router-outlet', () => {
        appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
        appTree = schematicRunner.runSchematic('application', Object.assign({}, appOptions, { routing: false }), appTree);
        expect(() => {
            schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        }).toThrowError();
    });
    it('should add a universal app', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.server.module.ts';
        expect(tree.exists(filePath)).toEqual(true);
    });
    it('should add app shell configuration', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        const filePath = '/angular.json';
        const content = tree.readContent(filePath);
        const workspace = JSON.parse(content);
        const target = workspace.projects.bar.architect['app-shell'];
        expect(target.options.browserTarget).toEqual('bar:build');
        expect(target.options.serverTarget).toEqual('bar:server');
        expect(target.options.route).toEqual('shell');
    });
    it('should add router module to client app module', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.module.ts';
        const content = tree.readContent(filePath);
        expect(content).toMatch(/import { RouterModule } from \'@angular\/router\';/);
    });
    describe('Add router-outlet', () => {
        function makeInlineTemplate(tree, template) {
            template = template || `
      <p>
        App works!
      </p>`;
            const newText = `
        import { Component, OnInit } from '@angular/core';

        @Component({
          selector: ''
          template: \`
            ${template}
          \`,
          styleUrls: ['./app.component.css']
        })
        export class AppComponent implements OnInit {

          constructor() { }

          ngOnInit() {
          }

        }

      `;
            tree.overwrite('/projects/bar/src/app/app.component.ts', newText);
            tree.delete('/projects/bar/src/app/app.component.html');
        }
        it('should not re-add the router outlet (external template)', () => {
            const htmlPath = '/projects/bar/src/app/app.component.html';
            appTree.overwrite(htmlPath, '<router-outlet></router-outlet>');
            const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
            const content = tree.readContent(htmlPath);
            const matches = content.match(/<router\-outlet><\/router\-outlet>/g);
            const numMatches = matches ? matches.length : 0;
            expect(numMatches).toEqual(1);
        });
        it('should not re-add the router outlet (inline template)', () => {
            makeInlineTemplate(appTree, '<router-outlet></router-outlet>');
            const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
            const content = tree.readContent('/projects/bar/src/app/app.component.ts');
            const matches = content.match(/<router\-outlet><\/router\-outlet>/g);
            const numMatches = matches ? matches.length : 0;
            expect(numMatches).toEqual(1);
        });
    });
    it('should add router imports to server module', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.server.module.ts';
        const content = tree.readContent(filePath);
        expect(content).toMatch(/import { Routes, RouterModule } from \'@angular\/router\';/);
    });
    it('should define a server route', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.server.module.ts';
        const content = tree.readContent(filePath);
        expect(content).toMatch(/const routes: Routes = \[/);
    });
    it('should import RouterModule with forRoot', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        const filePath = '/projects/bar/src/app/app.server.module.ts';
        const content = tree.readContent(filePath);
        expect(content)
            .toMatch(/const routes: Routes = \[ { path: 'shell', component: AppShellComponent }\];/);
        expect(content)
            .toMatch(/ServerModule,\r?\n\s*RouterModule\.forRoot\(routes\),/);
    });
    it('should create the shell component', () => {
        const tree = schematicRunner.runSchematic('appShell', defaultOptions, appTree);
        expect(tree.exists('/projects/bar/src/app/app-shell/app-shell.component.ts'));
        const content = tree.readContent('/projects/bar/src/app/app.server.module.ts');
        expect(content).toMatch(/app\-shell\.component/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL2FwcC1zaGVsbC9pbmRleF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0VBQXVGO0FBQ3ZGLDZCQUE2QjtBQU03QixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE1BQU0sZUFBZSxHQUFHLElBQUksNkJBQW1CLENBQzdDLHFCQUFxQixFQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUMzQyxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQW9CO1FBQ3RDLElBQUksRUFBRSxLQUFLO1FBQ1gsYUFBYSxFQUFFLEtBQUs7UUFDcEIsZ0JBQWdCLEVBQUUsV0FBVztLQUM5QixDQUFDO0lBRUYsTUFBTSxnQkFBZ0IsR0FBcUI7UUFDekMsSUFBSSxFQUFFLFdBQVc7UUFDakIsY0FBYyxFQUFFLFVBQVU7UUFDMUIsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUF1QjtRQUNyQyxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixlQUFlLEVBQUUsS0FBSztLQUN2QixDQUFDO0lBQ0YsSUFBSSxPQUFxQixDQUFDO0lBRTFCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBR0gsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxhQUFhLG9CQUFNLFVBQVUsSUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixlQUFlLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvRSxNQUFNLFFBQVEsR0FBRyw0Q0FBNEMsQ0FBQztRQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9FLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQztRQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0UsTUFBTSxRQUFRLEdBQUcscUNBQXFDLENBQUM7UUFDdkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLDRCQUE0QixJQUFrQixFQUFFLFFBQWlCO1lBQy9ELFFBQVEsR0FBRyxRQUFRLElBQUk7OztXQUdsQixDQUFDO1lBQ04sTUFBTSxPQUFPLEdBQUc7Ozs7OztjQU1SLFFBQVE7Ozs7Ozs7Ozs7Ozs7T0FhZixDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyx3Q0FBd0MsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsTUFBTSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUVELEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7WUFDakUsTUFBTSxRQUFRLEdBQUcsMENBQTBDLENBQUM7WUFDNUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztZQUMvRCxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFL0UsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFDckUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7WUFDL0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9FLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUMzRSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFDckUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0UsTUFBTSxRQUFRLEdBQUcsNENBQTRDLENBQUM7UUFDOUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLDREQUE0RCxDQUFDLENBQUM7SUFDeEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvRSxNQUFNLFFBQVEsR0FBRyw0Q0FBNEMsQ0FBQztRQUM5RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9FLE1BQU0sUUFBUSxHQUFHLDRDQUE0QyxDQUFDO1FBQzlELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNaLE9BQU8sQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDWixPQUFPLENBQUMsdURBQXVELENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDM0MsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHdEQUF3RCxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDL0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBTY2hlbWF0aWNUZXN0UnVubmVyLCBVbml0VGVzdFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgQXBwbGljYXRpb25PcHRpb25zIH0gZnJvbSAnLi4vYXBwbGljYXRpb24vc2NoZW1hJztcbmltcG9ydCB7IFNjaGVtYSBhcyBXb3Jrc3BhY2VPcHRpb25zIH0gZnJvbSAnLi4vd29ya3NwYWNlL3NjaGVtYSc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgQXBwU2hlbGxPcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5cbmRlc2NyaWJlKCdBcHAgU2hlbGwgU2NoZW1hdGljJywgKCkgPT4ge1xuICBjb25zdCBzY2hlbWF0aWNSdW5uZXIgPSBuZXcgU2NoZW1hdGljVGVzdFJ1bm5lcihcbiAgICAnQHNjaGVtYXRpY3MvYW5ndWxhcicsXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2NvbGxlY3Rpb24uanNvbicpLFxuICApO1xuICBjb25zdCBkZWZhdWx0T3B0aW9uczogQXBwU2hlbGxPcHRpb25zID0ge1xuICAgIG5hbWU6ICdmb28nLFxuICAgIGNsaWVudFByb2plY3Q6ICdiYXInLFxuICAgIHVuaXZlcnNhbFByb2plY3Q6ICd1bml2ZXJzYWwnLFxuICB9O1xuXG4gIGNvbnN0IHdvcmtzcGFjZU9wdGlvbnM6IFdvcmtzcGFjZU9wdGlvbnMgPSB7XG4gICAgbmFtZTogJ3dvcmtzcGFjZScsXG4gICAgbmV3UHJvamVjdFJvb3Q6ICdwcm9qZWN0cycsXG4gICAgdmVyc2lvbjogJzYuMC4wJyxcbiAgfTtcblxuICBjb25zdCBhcHBPcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7XG4gICAgbmFtZTogJ2JhcicsXG4gICAgaW5saW5lU3R5bGU6IGZhbHNlLFxuICAgIGlubGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICByb3V0aW5nOiB0cnVlLFxuICAgIHN0eWxlOiAnY3NzJyxcbiAgICBza2lwVGVzdHM6IGZhbHNlLFxuICAgIHNraXBQYWNrYWdlSnNvbjogZmFsc2UsXG4gIH07XG4gIGxldCBhcHBUcmVlOiBVbml0VGVzdFRyZWU7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3dvcmtzcGFjZScsIHdvcmtzcGFjZU9wdGlvbnMpO1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBsaWNhdGlvbicsIGFwcE9wdGlvbnMsIGFwcFRyZWUpO1xuICB9KTtcblxuXG4gIGl0KCdzaG91bGQgZW5zdXJlIHRoZSBjbGllbnQgYXBwIGhhcyBhIHJvdXRlci1vdXRsZXQnLCAoKSA9PiB7XG4gICAgYXBwVHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ3dvcmtzcGFjZScsIHdvcmtzcGFjZU9wdGlvbnMpO1xuICAgIGFwcFRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBsaWNhdGlvbicsIHsuLi5hcHBPcHRpb25zLCByb3V0aW5nOiBmYWxzZX0sIGFwcFRyZWUpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBTaGVsbCcsIGRlZmF1bHRPcHRpb25zLCBhcHBUcmVlKTtcbiAgICB9KS50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgYSB1bml2ZXJzYWwgYXBwJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBTaGVsbCcsIGRlZmF1bHRPcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9ICcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLnNlcnZlci5tb2R1bGUudHMnO1xuICAgIGV4cGVjdCh0cmVlLmV4aXN0cyhmaWxlUGF0aCkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIGFwcCBzaGVsbCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBTaGVsbCcsIGRlZmF1bHRPcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9ICcvYW5ndWxhci5qc29uJztcbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudChmaWxlUGF0aCk7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICBjb25zdCB0YXJnZXQgPSB3b3Jrc3BhY2UucHJvamVjdHMuYmFyLmFyY2hpdGVjdFsnYXBwLXNoZWxsJ107XG4gICAgZXhwZWN0KHRhcmdldC5vcHRpb25zLmJyb3dzZXJUYXJnZXQpLnRvRXF1YWwoJ2JhcjpidWlsZCcpO1xuICAgIGV4cGVjdCh0YXJnZXQub3B0aW9ucy5zZXJ2ZXJUYXJnZXQpLnRvRXF1YWwoJ2JhcjpzZXJ2ZXInKTtcbiAgICBleHBlY3QodGFyZ2V0Lm9wdGlvbnMucm91dGUpLnRvRXF1YWwoJ3NoZWxsJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIHJvdXRlciBtb2R1bGUgdG8gY2xpZW50IGFwcCBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2FwcFNoZWxsJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAubW9kdWxlLnRzJztcbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudChmaWxlUGF0aCk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2ltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gXFwnQGFuZ3VsYXJcXC9yb3V0ZXJcXCc7Lyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdBZGQgcm91dGVyLW91dGxldCcsICgpID0+IHtcbiAgICBmdW5jdGlvbiBtYWtlSW5saW5lVGVtcGxhdGUodHJlZTogVW5pdFRlc3RUcmVlLCB0ZW1wbGF0ZT86IHN0cmluZyk6IHZvaWQge1xuICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCBgXG4gICAgICA8cD5cbiAgICAgICAgQXBwIHdvcmtzIVxuICAgICAgPC9wPmA7XG4gICAgICBjb25zdCBuZXdUZXh0ID0gYFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yOiAnJ1xuICAgICAgICAgIHRlbXBsYXRlOiBcXGBcbiAgICAgICAgICAgICR7dGVtcGxhdGV9XG4gICAgICAgICAgXFxgLFxuICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJ11cbiAgICAgICAgfSlcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgICAgICAgbmdPbkluaXQoKSB7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgYDtcbiAgICAgIHRyZWUub3ZlcndyaXRlKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cycsIG5ld1RleHQpO1xuICAgICAgdHJlZS5kZWxldGUoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAuY29tcG9uZW50Lmh0bWwnKTtcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1hZGQgdGhlIHJvdXRlciBvdXRsZXQgKGV4dGVybmFsIHRlbXBsYXRlKScsICgpID0+IHtcbiAgICAgIGNvbnN0IGh0bWxQYXRoID0gJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAuY29tcG9uZW50Lmh0bWwnO1xuICAgICAgYXBwVHJlZS5vdmVyd3JpdGUoaHRtbFBhdGgsICc8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+Jyk7XG4gICAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnYXBwU2hlbGwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KGh0bWxQYXRoKTtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBjb250ZW50Lm1hdGNoKC88cm91dGVyXFwtb3V0bGV0PjxcXC9yb3V0ZXJcXC1vdXRsZXQ+L2cpO1xuICAgICAgY29uc3QgbnVtTWF0Y2hlcyA9IG1hdGNoZXMgPyBtYXRjaGVzLmxlbmd0aCA6IDA7XG4gICAgICBleHBlY3QobnVtTWF0Y2hlcykudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLWFkZCB0aGUgcm91dGVyIG91dGxldCAoaW5saW5lIHRlbXBsYXRlKScsICgpID0+IHtcbiAgICAgIG1ha2VJbmxpbmVUZW1wbGF0ZShhcHBUcmVlLCAnPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PicpO1xuICAgICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2FwcFNoZWxsJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJyk7XG4gICAgICBjb25zdCBtYXRjaGVzID0gY29udGVudC5tYXRjaCgvPHJvdXRlclxcLW91dGxldD48XFwvcm91dGVyXFwtb3V0bGV0Pi9nKTtcbiAgICAgIGNvbnN0IG51bU1hdGNoZXMgPSBtYXRjaGVzID8gbWF0Y2hlcy5sZW5ndGggOiAwO1xuICAgICAgZXhwZWN0KG51bU1hdGNoZXMpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIHJvdXRlciBpbXBvcnRzIHRvIHNlcnZlciBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ2FwcFNoZWxsJywgZGVmYXVsdE9wdGlvbnMsIGFwcFRyZWUpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAuc2VydmVyLm1vZHVsZS50cyc7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoZmlsZVBhdGgpO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9pbXBvcnQgeyBSb3V0ZXMsIFJvdXRlck1vZHVsZSB9IGZyb20gXFwnQGFuZ3VsYXJcXC9yb3V0ZXJcXCc7Lyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZGVmaW5lIGEgc2VydmVyIHJvdXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdhcHBTaGVsbCcsIGRlZmF1bHRPcHRpb25zLCBhcHBUcmVlKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9ICcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLnNlcnZlci5tb2R1bGUudHMnO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KGZpbGVQYXRoKTtcbiAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBcXFsvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBpbXBvcnQgUm91dGVyTW9kdWxlIHdpdGggZm9yUm9vdCcsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnYXBwU2hlbGwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgY29uc3QgZmlsZVBhdGggPSAnL3Byb2plY3RzL2Jhci9zcmMvYXBwL2FwcC5zZXJ2ZXIubW9kdWxlLnRzJztcbiAgICBjb25zdCBjb250ZW50ID0gdHJlZS5yZWFkQ29udGVudChmaWxlUGF0aCk7XG4gICAgZXhwZWN0KGNvbnRlbnQpXG4gICAgICAudG9NYXRjaCgvY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBcXFsgeyBwYXRoOiAnc2hlbGwnLCBjb21wb25lbnQ6IEFwcFNoZWxsQ29tcG9uZW50IH1cXF07Lyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpXG4gICAgICAudG9NYXRjaCgvU2VydmVyTW9kdWxlLFxccj9cXG5cXHMqUm91dGVyTW9kdWxlXFwuZm9yUm9vdFxcKHJvdXRlc1xcKSwvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgdGhlIHNoZWxsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnYXBwU2hlbGwnLCBkZWZhdWx0T3B0aW9ucywgYXBwVHJlZSk7XG4gICAgZXhwZWN0KHRyZWUuZXhpc3RzKCcvcHJvamVjdHMvYmFyL3NyYy9hcHAvYXBwLXNoZWxsL2FwcC1zaGVsbC5jb21wb25lbnQudHMnKSk7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wcm9qZWN0cy9iYXIvc3JjL2FwcC9hcHAuc2VydmVyLm1vZHVsZS50cycpO1xuICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9hcHBcXC1zaGVsbFxcLmNvbXBvbmVudC8pO1xuICB9KTtcbn0pO1xuIl19