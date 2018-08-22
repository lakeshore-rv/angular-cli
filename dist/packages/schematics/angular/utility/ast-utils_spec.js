"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("typescript");
const change_1 = require("../utility/change");
const test_1 = require("../utility/test");
const ast_utils_1 = require("./ast-utils");
function getTsSource(path, content) {
    return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}
function applyChanges(path, content, changes) {
    const tree = new schematics_1.HostTree();
    tree.create(path, content);
    const exportRecorder = tree.beginUpdate(path);
    for (const change of changes) {
        if (change instanceof change_1.InsertChange) {
            exportRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    tree.commitUpdate(exportRecorder);
    return test_1.getFileContent(tree, path);
}
describe('ast utils', () => {
    let modulePath;
    let moduleContent;
    beforeEach(() => {
        modulePath = '/src/app/app.module.ts';
        moduleContent = `
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
    `;
    });
    it('should add export to module', () => {
        const source = getTsSource(modulePath, moduleContent);
        const changes = ast_utils_1.addExportToModule(source, modulePath, 'FooComponent', './foo.component');
        const output = applyChanges(modulePath, moduleContent, changes);
        expect(output).toMatch(/import { FooComponent } from '.\/foo.component';/);
        expect(output).toMatch(/exports: \[FooComponent\]/);
    });
    it('should add export to module if not indented', () => {
        moduleContent = core_1.tags.stripIndents `${moduleContent}`;
        const source = getTsSource(modulePath, moduleContent);
        const changes = ast_utils_1.addExportToModule(source, modulePath, 'FooComponent', './foo.component');
        const output = applyChanges(modulePath, moduleContent, changes);
        expect(output).toMatch(/import { FooComponent } from '.\/foo.component';/);
        expect(output).toMatch(/exports: \[FooComponent\]/);
    });
    it('should add metadata', () => {
        const source = getTsSource(modulePath, moduleContent);
        const changes = ast_utils_1.addSymbolToNgModuleMetadata(source, modulePath, 'imports', 'HelloWorld');
        expect(changes).not.toBeNull();
        const output = applyChanges(modulePath, moduleContent, changes || []);
        expect(output).toMatch(/imports: [\s\S]+,\n\s+HelloWorld\n\s+\]/m);
    });
    it('should add metadata (comma)', () => {
        const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        imports: [
          BrowserModule,
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
        const source = getTsSource(modulePath, moduleContent);
        const changes = ast_utils_1.addSymbolToNgModuleMetadata(source, modulePath, 'imports', 'HelloWorld');
        expect(changes).not.toBeNull();
        const output = applyChanges(modulePath, moduleContent, changes || []);
        expect(output).toMatch(/imports: [\s\S]+,\n\s+HelloWorld,\n\s+\]/m);
    });
    it('should add metadata (missing)', () => {
        const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
        const source = getTsSource(modulePath, moduleContent);
        const changes = ast_utils_1.addSymbolToNgModuleMetadata(source, modulePath, 'imports', 'HelloWorld');
        expect(changes).not.toBeNull();
        const output = applyChanges(modulePath, moduleContent, changes || []);
        expect(output).toMatch(/imports: \[HelloWorld]\r?\n/m);
    });
    it('should add metadata (empty)', () => {
        const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        providers: [],
        imports: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
        const source = getTsSource(modulePath, moduleContent);
        const changes = ast_utils_1.addSymbolToNgModuleMetadata(source, modulePath, 'imports', 'HelloWorld');
        expect(changes).not.toBeNull();
        const output = applyChanges(modulePath, moduleContent, changes || []);
        expect(output).toMatch(/imports: \[HelloWorld],\r?\n/m);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LXV0aWxzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2FzdC11dGlsc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7Ozs7OztHQU1HO0FBQ0gsK0NBQTRDO0FBQzVDLDJEQUFzRDtBQUN0RCxpQ0FBaUM7QUFDakMsOENBQXlEO0FBQ3pELDBDQUFpRDtBQUNqRCwyQ0FBNkU7QUFHN0UscUJBQXFCLElBQVksRUFBRSxPQUFlO0lBQ2hELE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVELHNCQUFzQixJQUFZLEVBQUUsT0FBZSxFQUFFLE9BQWlCO0lBQ3BFLE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVEsRUFBRSxDQUFDO0lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDNUIsSUFBSSxNQUFNLFlBQVkscUJBQVksRUFBRTtZQUNsQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JEO0tBQ0Y7SUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRWxDLE9BQU8scUJBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksVUFBa0Is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QyxNQUFNLGFBQWEsR0FBRzs7Ozs7Ozs7Ozs7O0tBWXJCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sT0FBTyxHQUFHLHVDQUEyQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFL0IsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDckMsTUFBTSxhQUFhLEdBQUc7Ozs7Ozs7Ozs7Ozs7S0FhckIsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdEQsTUFBTSxPQUFPLEdBQUcsdUNBQTJCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDekYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUUvQixNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBIb3N0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHsgQ2hhbmdlLCBJbnNlcnRDaGFuZ2UgfSBmcm9tICcuLi91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQgeyBnZXRGaWxlQ29udGVudCB9IGZyb20gJy4uL3V0aWxpdHkvdGVzdCc7XG5pbXBvcnQgeyBhZGRFeHBvcnRUb01vZHVsZSwgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhIH0gZnJvbSAnLi9hc3QtdXRpbHMnO1xuXG5cbmZ1bmN0aW9uIGdldFRzU291cmNlKHBhdGg6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogdHMuU291cmNlRmlsZSB7XG4gIHJldHVybiB0cy5jcmVhdGVTb3VyY2VGaWxlKHBhdGgsIGNvbnRlbnQsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpO1xufVxuXG5mdW5jdGlvbiBhcHBseUNoYW5nZXMocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGNoYW5nZXM6IENoYW5nZVtdKTogc3RyaW5nIHtcbiAgY29uc3QgdHJlZSA9IG5ldyBIb3N0VHJlZSgpO1xuICB0cmVlLmNyZWF0ZShwYXRoLCBjb250ZW50KTtcbiAgY29uc3QgZXhwb3J0UmVjb3JkZXIgPSB0cmVlLmJlZ2luVXBkYXRlKHBhdGgpO1xuICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgZXhwb3J0UmVjb3JkZXIuaW5zZXJ0TGVmdChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgIH1cbiAgfVxuICB0cmVlLmNvbW1pdFVwZGF0ZShleHBvcnRSZWNvcmRlcik7XG5cbiAgcmV0dXJuIGdldEZpbGVDb250ZW50KHRyZWUsIHBhdGgpO1xufVxuXG5kZXNjcmliZSgnYXN0IHV0aWxzJywgKCkgPT4ge1xuICBsZXQgbW9kdWxlUGF0aDogc3RyaW5nO1xuICBsZXQgbW9kdWxlQ29udGVudDogc3RyaW5nO1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBtb2R1bGVQYXRoID0gJy9zcmMvYXBwL2FwcC5tb2R1bGUudHMnO1xuICAgIG1vZHVsZUNvbnRlbnQgPSBgXG4gICAgICBpbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG4gICAgICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcblxuICAgICAgQE5nTW9kdWxlKHtcbiAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgICAgIF0sXG4gICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICBCcm93c2VyTW9kdWxlXG4gICAgICAgIF0sXG4gICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICAgIH0pXG4gICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuICAgIGA7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIGV4cG9ydCB0byBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0VHNTb3VyY2UobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCk7XG4gICAgY29uc3QgY2hhbmdlcyA9IGFkZEV4cG9ydFRvTW9kdWxlKHNvdXJjZSwgbW9kdWxlUGF0aCwgJ0Zvb0NvbXBvbmVudCcsICcuL2Zvby5jb21wb25lbnQnKTtcbiAgICBjb25zdCBvdXRwdXQgPSBhcHBseUNoYW5nZXMobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCwgY2hhbmdlcyk7XG4gICAgZXhwZWN0KG91dHB1dCkudG9NYXRjaCgvaW1wb3J0IHsgRm9vQ29tcG9uZW50IH0gZnJvbSAnLlxcL2Zvby5jb21wb25lbnQnOy8pO1xuICAgIGV4cGVjdChvdXRwdXQpLnRvTWF0Y2goL2V4cG9ydHM6IFxcW0Zvb0NvbXBvbmVudFxcXS8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBleHBvcnQgdG8gbW9kdWxlIGlmIG5vdCBpbmRlbnRlZCcsICgpID0+IHtcbiAgICBtb2R1bGVDb250ZW50ID0gdGFncy5zdHJpcEluZGVudHNgJHttb2R1bGVDb250ZW50fWA7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0VHNTb3VyY2UobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCk7XG4gICAgY29uc3QgY2hhbmdlcyA9IGFkZEV4cG9ydFRvTW9kdWxlKHNvdXJjZSwgbW9kdWxlUGF0aCwgJ0Zvb0NvbXBvbmVudCcsICcuL2Zvby5jb21wb25lbnQnKTtcbiAgICBjb25zdCBvdXRwdXQgPSBhcHBseUNoYW5nZXMobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCwgY2hhbmdlcyk7XG4gICAgZXhwZWN0KG91dHB1dCkudG9NYXRjaCgvaW1wb3J0IHsgRm9vQ29tcG9uZW50IH0gZnJvbSAnLlxcL2Zvby5jb21wb25lbnQnOy8pO1xuICAgIGV4cGVjdChvdXRwdXQpLnRvTWF0Y2goL2V4cG9ydHM6IFxcW0Zvb0NvbXBvbmVudFxcXS8pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBtZXRhZGF0YScsICgpID0+IHtcbiAgICBjb25zdCBzb3VyY2UgPSBnZXRUc1NvdXJjZShtb2R1bGVQYXRoLCBtb2R1bGVDb250ZW50KTtcbiAgICBjb25zdCBjaGFuZ2VzID0gYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKHNvdXJjZSwgbW9kdWxlUGF0aCwgJ2ltcG9ydHMnLCAnSGVsbG9Xb3JsZCcpO1xuICAgIGV4cGVjdChjaGFuZ2VzKS5ub3QudG9CZU51bGwoKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGFwcGx5Q2hhbmdlcyhtb2R1bGVQYXRoLCBtb2R1bGVDb250ZW50LCBjaGFuZ2VzIHx8IFtdKTtcbiAgICBleHBlY3Qob3V0cHV0KS50b01hdGNoKC9pbXBvcnRzOiBbXFxzXFxTXSssXFxuXFxzK0hlbGxvV29ybGRcXG5cXHMrXFxdL20pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBtZXRhZGF0YSAoY29tbWEpJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZUNvbnRlbnQgPSBgXG4gICAgICBpbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG4gICAgICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgICBATmdNb2R1bGUoe1xuICAgICAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgICBBcHBDb21wb25lbnRcbiAgICAgICAgXSxcbiAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgICAgIF0sXG4gICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICAgIH0pXG4gICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuICAgIGA7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0VHNTb3VyY2UobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCk7XG4gICAgY29uc3QgY2hhbmdlcyA9IGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShzb3VyY2UsIG1vZHVsZVBhdGgsICdpbXBvcnRzJywgJ0hlbGxvV29ybGQnKTtcbiAgICBleHBlY3QoY2hhbmdlcykubm90LnRvQmVOdWxsKCk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhcHBseUNoYW5nZXMobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCwgY2hhbmdlcyB8fCBbXSk7XG4gICAgZXhwZWN0KG91dHB1dCkudG9NYXRjaCgvaW1wb3J0czogW1xcc1xcU10rLFxcblxccytIZWxsb1dvcmxkLFxcblxccytcXF0vbSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIG1ldGFkYXRhIChtaXNzaW5nKScsICgpID0+IHtcbiAgICBjb25zdCBtb2R1bGVDb250ZW50ID0gYFxuICAgICAgaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuICAgICAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgQE5nTW9kdWxlKHtcbiAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgICAgIF0sXG4gICAgICAgIHByb3ZpZGVyczogW10sXG4gICAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICAgIH0pXG4gICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuICAgIGA7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0VHNTb3VyY2UobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCk7XG4gICAgY29uc3QgY2hhbmdlcyA9IGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShzb3VyY2UsIG1vZHVsZVBhdGgsICdpbXBvcnRzJywgJ0hlbGxvV29ybGQnKTtcbiAgICBleHBlY3QoY2hhbmdlcykubm90LnRvQmVOdWxsKCk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhcHBseUNoYW5nZXMobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCwgY2hhbmdlcyB8fCBbXSk7XG4gICAgZXhwZWN0KG91dHB1dCkudG9NYXRjaCgvaW1wb3J0czogXFxbSGVsbG9Xb3JsZF1cXHI/XFxuL20pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBtZXRhZGF0YSAoZW1wdHkpJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZUNvbnRlbnQgPSBgXG4gICAgICBpbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG4gICAgICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgICBATmdNb2R1bGUoe1xuICAgICAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgICBBcHBDb21wb25lbnRcbiAgICAgICAgXSxcbiAgICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgICAgaW1wb3J0czogW10sXG4gICAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICAgIH0pXG4gICAgICBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuICAgIGA7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0VHNTb3VyY2UobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCk7XG4gICAgY29uc3QgY2hhbmdlcyA9IGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShzb3VyY2UsIG1vZHVsZVBhdGgsICdpbXBvcnRzJywgJ0hlbGxvV29ybGQnKTtcbiAgICBleHBlY3QoY2hhbmdlcykubm90LnRvQmVOdWxsKCk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhcHBseUNoYW5nZXMobW9kdWxlUGF0aCwgbW9kdWxlQ29udGVudCwgY2hhbmdlcyB8fCBbXSk7XG4gICAgZXhwZWN0KG91dHB1dCkudG9NYXRjaCgvaW1wb3J0czogXFxbSGVsbG9Xb3JsZF0sXFxyP1xcbi9tKTtcbiAgfSk7XG59KTtcbiJdfQ==